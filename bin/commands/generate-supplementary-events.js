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
      ]
    });


    const studentRegsWithSupplementary = studentRegs.filter((studentReg) => {
      const failedEvents = studentReg.Events.filter((event) => {
        const eventFailed = event.grade <= 1 && event.grade !== null;
        const deliverableFailed = event.Deliverables.some(deliverable => !deliverable.uploaded || (deliverable.grade < 2 && deliverable.grade !== null));

        return eventFailed || deliverableFailed;
      });
      return failedEvents.length === 1;
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

    for (const studentReg of studentRegsWithSupplementary) {
      console.log(`Creating event for ${studentReg.User.neptun}`);
      // Check room
      let currentRoom = null;
      if (rooms[currentRoomIndex].currentUsage < rooms[currentRoomIndex].capacity) {
        currentRoom = rooms[currentRoomIndex];
      } else {
        currentRoomIndex++;
        currentRoom = rooms[currentRoomIndex];
      }
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

      const failedEvent = studentReg.Events.find((event) => {
        const eventFailed = event.grade <= 1 && event.grade !== null;
        const deliverableFailed = event.Deliverables.some(deliverable => !deliverable.uploaded || (deliverable.grade < 2 && deliverable.grade !== null));
        return eventFailed || deliverableFailed;
      });

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
        const deadline = moment(eventDate).add(1, 'd').add(15, 'm');

        await db.Deliverables.create({
          deadline,
          EventId: newEvent.id,
          DeliverableTemplateId: deliverableTemplate.dataValues.id
        });
      }
      // random new exerciseType
      const failedExerciseType = failedEvent.ExerciseSheet.ExerciseType;
      if (failedExerciseType.id === exTypes[currentExTypeIndex].id) {
        currentExTypeIndex++;
      }
      const currentExType = exTypes[currentExTypeIndex];
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
  } catch (err) {
    console.log(err);
  } finally {
    closeDB();
  }
};