const xmlbuilder = require('xmlbuilder');


function generateHandout(event) {
  const exerciseSheet = event.ExerciseSheet;
  console.log(exerciseSheet);
  const exerciseCategory = exerciseSheet.ExerciseCategory;
  const exerciseType = exerciseSheet.ExerciseType;
  const student = event.StudentRegistration.User;
  const demonstrator = event.Demonstrator;


  const categoryId = exerciseCategory.id;
  const categoryName = exerciseCategory.type;
  const exerciseTypeId = exerciseType.id;
  const shortName = exerciseType.shortName;
  const exerciseTypeName = exerciseType.name;
  const studentName = student.displayName;
  const demonstratorName = demonstrator.displayName;
  const timeOfEvent = event.date;
  const initialPassword = student.initPassword;

  return {
    'exercise-description': {
      '@category': categoryId,
      '@category-name': categoryName,
      '@type': exerciseTypeId,
      '@shortname': shortName,
      '#text': exerciseTypeName
    },
    entries: {
      entry: [
        {
          '@description': 'Hallgató neve',
          '#text': studentName
        },
        {
          '@description': 'Mérésvezető',
          '#text': demonstratorName
        },
        {
          '@description': 'Mérés időpontja',
          '#text': timeOfEvent.toDateString()
        },
        {
          '@description': 'Portál jelszó',
          '#text': initialPassword
        }
      ]
    }
  };
}

function concatHandouts(handouts) {
  return {
    handouts
  };
}

function generateXml(handoutsObj) {
  const node = xmlbuilder.create(handoutsObj);
  return node.end({ pretty: true });
}

module.exports = event => generateXml(concatHandouts([generateHandout(event)]));

