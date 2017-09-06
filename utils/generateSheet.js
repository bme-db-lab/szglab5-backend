const xmlbuilder = require('xmlbuilder');

function magicPasswordGeneratorThatDefinitelyShouldNotBeHereOrImplementedLikeThis(student) {
  const md5 = require('crypto').createHash('md5');
  const year = (new Date()).getFullYear();
  md5.update(year.toString() + student.id);
  return md5.digest('base64').substr(0, 10);
}

module.exports = (exerciseCategory, exerciseType, student, demonstrator, event) => {
  const categoryId = exerciseCategory.id;
  const categoryName = exerciseCategory.type;
  const exerciseTypeId = exerciseType.id;
  const shortName = exerciseType.shortName;
  const exerciseTypeName = exerciseType.name;
  const studentName = student.displayName;
  const demonstratorName = demonstrator.displayName;
  const timeOfEvent = event.date;
  const initialPassword = magicPasswordGeneratorThatDefinitelyShouldNotBeHereOrImplementedLikeThis(student);

  const xmlNode = xmlbuilder.create({
    handouts: {
      handout: {
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
      }
    }
  });

  const str = xmlNode.end({ pretty: true });
  return str;
};
