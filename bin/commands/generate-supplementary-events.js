const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const moment = require('moment');

const { initDB, closeDB } = require('../../db/db.js');

const exTypesToSkip = [
  52,
  57,
  63
];

function getRoomForStudent(rooms, exerciseCategory) {
  const suitableRoom = rooms.find((room) => {
    const exCatok = room.exerciseCategories.includes(exerciseCategory);
    const hasMoreRoom = room.currentUsage < room.capacity;

    return exCatok && hasMoreRoom;
  });

  if (!suitableRoom) {
    throw new Error(`No room for ${exerciseCategory}`);
  }

  return suitableRoom;
}


module.exports = async () => {
  try {
    const db = await initDB();

    console.log('Getting students');
    const studentRegs = await db.StudentRegistrations.findAll({
      include: [
        {
          model: db.Events,
          include: [
            {
              where: {},
              model: db.Deliverables,
              include: {
                model: db.DeliverableTemplates,
                where: { type: 'FILE' }
              }
            },
            {
              model: db.ExerciseSheets,
              include: [
                {
                  model: db.ExerciseCategories
                },
                {
                  model: db.ExerciseTypes
                }
              ]
            }
          ]
        },
        {
          where: {},
          model: db.Users,
          include: {
            model: db.Roles,
            where: {
              name: 'STUDENT'
            }
          }
        },
        {
          // exclude english student group
          where: { name: { $ne: 'c12-A' } },
          model: db.StudentGroups
        }
      ]
    });


    const studentRegsWithSupplementary = studentRegs.filter((studentReg) => {
      const okEvents = studentReg.Events.filter((event) => {
        const eventOk = event.grade >= 2;
        const deliverableOk = event.Deliverables.every(deliverable => deliverable.uploaded && deliverable.grade >= 2);

        return eventOk || (deliverableOk && event.grade === null);
      });
      return okEvents.length === 4;
    });

    const capacityNeeded = studentRegsWithSupplementary.length;
    console.log(`Capacity needed: ${capacityNeeded}`);

    const jsonFiles = fs.readdirSync(path.join(__dirname, 'data'));

    const jsonFileChoices =
      jsonFiles
        .filter(jsonFile => jsonFile.match(/.json$/g))
        .map(jsonFile => ({
          name: jsonFile,
          value: jsonFile
        }));

    const prompt = await inquirer.prompt([
      {
        type: 'list',
        choices: jsonFileChoices,
        message: 'json file',
        name: 'path'
      }
    ]);

    const jsonFile = fs.readFileSync(path.join(__dirname, 'data', prompt.path));
    const supplementaryConfig = JSON.parse(jsonFile);
    console.log('---------------------------');
    console.log('Supplementary config');
    console.log(supplementaryConfig);
    console.log('---------------------------');

    // Checking if capacity is enough
    const actualCapacity = supplementaryConfig.reduce((acc, supplConfObj) => acc + supplConfObj.capacity, 0);
    console.log(`Actual capacity: ${actualCapacity}`);
    if (actualCapacity < capacityNeeded) {
      throw new Error('Not enough capacity!');
    }

    let nameIndex = 0;
    console.log('Generate StudentGroups and Appointments');
    const rooms = [];
    let currentRoomIndex = 0;

    for (const supplementaryConfigObj of supplementaryConfig) {
      console.log(nameIndex);
      const demonstrator = await db.Users.find({
        where: {
          loginName: supplementaryConfigObj.demonstrator
        }
      });
      if (!demonstrator) {
        console.log(`Demonstrator not found: ${supplementaryConfigObj.demonstrator}`);
      }

      const newStudentGroup = await db.StudentGroups.create({
        name: `pot${nameIndex}`,
        SemesterId: 1,
        UserId: demonstrator.id,
        language: 'magyar'
      });
      nameIndex++;

      await db.Appointments.create({
        date: supplementaryConfigObj.date,
        location: supplementaryConfigObj.location,
        StudentGroupId: newStudentGroup.id
      });

      rooms.push({
        date: supplementaryConfigObj.date,
        location: supplementaryConfigObj.location,
        capacity: supplementaryConfigObj.capacity,
        studentGroupId: newStudentGroup.id,
        demonstratorId: demonstrator.id,
        exerciseCategories: supplementaryConfigObj.exerciseCategories,
        currentUsage: 0
      });
    }
    // console.log('Generate EventTemplates');
    // const exerciseCategories = await db.ExerciseCategories.findAll();
    // for (const exerciseCategory of exerciseCategories) {
    //   db.EventTemplates.create({
    //   });
    // }
    const exTypes = await db.ExerciseTypes.findAll({
      where: {
        exerciseId: { $notIn: exTypesToSkip }
      }
    });
    let currentExTypeIndex = 0;

    const eventTemplates = await db.EventTemplates.findAll({
      include: {
        model: db.ExerciseCategories
      },
      order: ['seqNumber']
    });

    const exCategories = eventTemplates.map(eventTemplate => eventTemplate.ExerciseCategory.type);

    const exTypeStats = exTypes.map(exType => ({ id: exType.id, count: 0, shortName: exType.shortName }));

    const failedEventStats = {};
    exCategories.forEach((exCategory) => {
      failedEventStats[exCategory] = 0;
    });

    for (const studentReg of studentRegsWithSupplementary) {
      console.log(`Creating event for ${studentReg.User.neptun}`);
      // // Check room
      // let currentRoom = null;
      // if (rooms[currentRoomIndex].currentUsage < rooms[currentRoomIndex].capacity) {
      //   currentRoom = rooms[currentRoomIndex];
      // } else {
      //   currentRoomIndex++;
      //   currentRoom = rooms[currentRoomIndex];
      // }
      const failedEvent = studentReg.Events.find((event) => {
        const eventFailed = event.grade <= 1;
        return eventFailed;
      });
      failedEventStats[failedEvent.ExerciseSheet.ExerciseCategory.type]++;
      console.log(failedEventStats);

      const currentRoom = getRoomForStudent(rooms, failedEvent.ExerciseSheet.ExerciseCategory.type);
      currentRoom.currentUsage++;

      const newEvent = await db.Events.create({
        date: currentRoom.date,
        location: currentRoom.location,
        grade: null,
        finalized: false,
        comment: null,
        imsc: null,
        attempt: 2,
        DemonstratorId: currentRoom.demonstratorId
      });
      await studentReg.addEvent(newEvent);

      const failedExerciseCategory = failedEvent.ExerciseSheet.ExerciseCategory;
      // connect event-template
      const eventTemplate = await db.EventTemplates.find({
        where: { ExerciseCategoryId: failedExerciseCategory.id }
      });
      await newEvent.setEventTemplate(eventTemplate);
      const deliverableTemplates = await eventTemplate.getDeliverableTemplates();
      // generate deliverables
      console.log(`Event: loc - "${newEvent.location}" date - "${newEvent.dataValues.date}"`);
      for (const deliverableTemplate of deliverableTemplates) {
        console.log(` DeliverableTemplate: type - "${deliverableTemplate.dataValues.type}" name - "${deliverableTemplate.dataValues.name}" desc - "${deliverableTemplate.dataValues.description}"`);
        const eventDate = newEvent.date;
        const deadline = moment(eventDate).add(3, 'd');

        await db.Deliverables.create({
          deadline,
          EventId: newEvent.id,
          DeliverableTemplateId: deliverableTemplate.dataValues.id
        });
      }
      // random new exerciseType
      const failedExerciseType = failedEvent.ExerciseSheet.ExerciseType;
      if ((failedExerciseType.id === exTypes[currentExTypeIndex].id)) {
        if (currentExTypeIndex < (exTypes.length - 1)) {
          currentExTypeIndex++;
        } else {
          currentExTypeIndex = 0;
        }
      }
      console.log(`Student exercise type: ${failedExerciseType.shortName} -> ${exTypes[currentExTypeIndex].shortName}`);
      const currentExType = exTypes[currentExTypeIndex];
      exTypeStats[currentExTypeIndex].count++;

      if (currentExTypeIndex < exTypes.length - 1) {
        currentExTypeIndex += 1;
      } else {
        currentExTypeIndex = 0;
      }
      // connect exercise sheet
      const exSheet = await db.ExerciseSheets.find({
        where: {
          ExerciseCategoryId: failedExerciseCategory.id,
          ExerciseTypeId: currentExType.id
        }
      });
      await newEvent.update({
        ExerciseSheetId: exSheet.id
      });
    }
    console.log('Exercise type statistics:');
    console.log(exTypeStats);
  } catch (err) {
    console.log(err);
  } finally {
    closeDB();
  }
};
