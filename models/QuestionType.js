module.exports = (sequelize, DataTypes) => {
  const QuestonType = sequelize.define('QuestionType', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => {
        // Test.hasMany(models.TestQuestion, {as: 'questions'});
        QuestonType.hasMany(models.TestQuestion, {as: 'questionType'});
      }
    }
  });

  return QuestonType;
};
