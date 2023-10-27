const config = require('../../config/config.js');
const { genErrorObj } = require('../../utils/utils.js');
const { getDB } = require('../../db/db.js');
const moment = require('moment');

module.exports = async (req, res) => {
  try {
    const { roles } = req.userInfo;

    // only ADMIN DEMONSTRATOR CORRECTOR
    if (!roles.includes('ADMIN') && !roles.includes('DEMONSTRATOR') && !roles.includes('CORRECTOR')) {
      res.status(403).send(genErrorObj('Unathorized'));
      return;
    }

    const { studentNeptun, newStudentGroupId, eventTemplateId, resetGrades } = req.body;
    console.log(req.body);

    if (studentNeptun === undefined || newStudentGroupId === undefined || eventTemplateId === undefined || resetGrades === undefined) {
      res.status(400).send(genErrorObj('Please provide studentNeptun newStudentGroupId eventTemplateId resetGrades'));
      return;
    }

    const db = getDB();

    const student = await db.Users.find({
      where: { neptun: { ilike: studentNeptun } },
      include: {
        model: db.StudentRegistrations,
        include: {
          model: db.StudentGroups
        }
      }
    });

    if (!student) {
      const error = new Error('Student not found!');
      error.notFound = true;
      throw error;
    }

    const studentRegs = await student.getStudentRegistrations();
    const studentReg = studentRegs[0];

    const eventToUpdate = await db.Events.find({
      where: {
        EventTemplateId: eventTemplateId,
        StudentRegistrationId: studentReg.id
      }
    });
    if (!eventToUpdate) {
      const error = new Error('Event not found!');
      error.notFound = true;
      throw error;
    }

    // get new Appointment
    const appointment = await db.Appointments.find({
      where: {
        StudentGroupId: newStudentGroupId,
        EventTemplateId: eventTemplateId
      }
    });
    if (!appointment) {
      const error = new Error('Appointment not found!');
      error.notFound = true;
      throw error;
    }

    // get new StudentGroup
    const studentGroup = await db.StudentGroups.findById(newStudentGroupId, {
      include: {
        model: db.Users
      }
    });
    if (!studentGroup) {
      const error = new Error('Student group not found!');
      error.notFound = true;
      throw error;
    }

    const updateEventInfo = {
      location: appointment.dataValues.location,
      date: appointment.dataValues.date,
      DemonstratorId: studentGroup.dataValues.UserId
    };
    console.log('Student changing group to:');
    console.log(updateEventInfo);

    await db.Events.update(
      {
        date: moment(updateEventInfo.date).add(15, 'm'),
        location: updateEventInfo.location,
        DemonstratorId: updateEventInfo.DemonstratorId,
      },
      {
        where: { id: eventToUpdate.id }
      }
    );
    if (resetGrades) {
      await db.Events.update(
        {
          finalized: false,
          grade: null
        },
        {
          where: { id: eventToUpdate.id }
        }
      );
    }

    const deliverables = await eventToUpdate.getDeliverables();

    for (const deliverable of deliverables) {
      const deadline = moment(updateEventInfo.date).add(config.defaultDeadlineDays, 'd').add(15, 'm');
      await db.Deliverables.update(
        {
          deadline,
        },
        {
          where: { id: deliverable.id },
          include: {
            model: db.DeliverableTemplates,
            where: {
              type: 'FILE'
            }
          }
        }
      );
    }

    if (resetGrades) {
      for (const deliverable of deliverables) {
        await db.Deliverables.update(
          {
            lastSubmittedDate: null,
            grading: false,
            grade: null,
            imsc: 0,
            finalized: false,
            CorrectorId: null
          },
          {
            where: { id: deliverable.id },
            include: {
              model: db.DeliverableTemplates,
              where: {
                type: 'FILE'
              }
            }
          }
        );
      }
    }
    res.status(204).send();
  } catch (err) {
    if (err.notFound) {
      res.status(404).send(genErrorObj(err.message));
      return;
    }
    res.status(500).send(genErrorObj(err.message));
  }
};
