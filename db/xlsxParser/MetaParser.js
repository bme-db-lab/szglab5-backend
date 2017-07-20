const logger = require('../../utils/logger.js');
const XLSX = require('xlsx');


function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}


module.exports = () => {
  let seed = null;
  try {
    const seedFile = 'db/seedData/beosztas-minta.xlsx';
    const sheetName = 'Altalanos';
    const opts = {
      sheetStubs: true,
    };
    const workbook = XLSX.readFile(seedFile, opts);
    seed = workbook.Sheets[sheetName];
  } catch (err) {
    return err;
  }

  if (seed !== null) {
    const metadata = {
      courses: [],
      semesters: [],
      exercisecategories: [],
      eventtemplates: [],
      deliverabletemplates: [] };
    let course = { data: {} };
    let semester = { data: {} };
    let category = { data: {} };
    let eTemplate = { data: {} };
    let dTemplate = { data: {} };
    Object.keys(seed).some(
    (key) => {
      const reg = /([A-Z]+)([0-9]+)/;
      const rKey = reg.exec(key);
      if (rKey === null) {
        return false;
      }
      switch (parseInt(rKey[2], 10) % 6) {
        case 1:
          if (key[0] === 'B') {
            course = { data: {} };
            if (seed[key].w !== undefined) {
              course.data.name = seed[key].w;
            } else {
              course.data.id = null;
            }
          } else if (key[0] === 'C') {
            if (seed[key].w !== undefined) {
              course.data.codeName = seed[key].w;
              if (metadata.courses[seed[key].w] === undefined ||
                metadata.courses[seed[key].w] === null) {
                metadata.courses[course.data.codeName] = course;
              }
              metadata.courses.push(course);
            } else {
              course.data.codeName = null;
            }
          }
          break;
        case 2:
          if (key[0] === 'B') {
            semester = { data: {} };
            if (seed[key].w !== undefined) {
              semester.data.academicyear = seed[key].w;
            } else {
              semester.data.academicyear = null;
            }
          } else if (key[0] === 'C') {
            if (seed[key].w !== undefined) {
              semester.data.academicterm = seed[key].w;
              if (semester.data.academicyear != null) {
                semester.data.CourseCodeName = course.data.codeName;
                metadata.semesters.push(semester);
              }
            } else {
              semester.data.academicterm = null;
            }
          }
          break;
        case 3:
          if (key[0] !== 'A' && seed[key].w !== undefined) {
            category = { data: {} };
            category.data.type = seed[key].w;
            category.data.CourseCodeName = course.data.codeName;
            metadata.exercisecategories.push(category);
          } else {
            category.data.name = null;
          }
          break;
        case 4:
          if (key[0] === 'B' && seed[key].w !== undefined) {
            eTemplate = { data: {} };
            eTemplate.data.title = seed[key].w;
          } else {
            eTemplate.data.title = null;
          }
          if (key[0] === 'C' && seed[key].w !== undefined) {
            eTemplate = { data: {} };
            eTemplate.data.number = seed[key].w;
            metadata.eventtemplates.push(eTemplate);
          } else {
            eTemplate.data.number = null;
          }
          break;
        case 5:
          if (key[0] !== 'A' && seed[key].w !== undefined) {
            dTemplate = { data: {} };
            dTemplate.data.description = seed[key].w;
            metadata.deliverabletemplates.push(dTemplate);
          } else {
            dTemplate.data.description = null;
          }
          break;
        default:
      }
      return false;
    });
    console.log(metadata.courses);
    return metadata;
  }
  logger.warn('No seed data provided');
  return null;
};