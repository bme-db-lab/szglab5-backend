module.exports = (sequelize, DataTypes) => {
  const QuestionTypes = sequelize.define('QuestionTypes', {
    name: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    classMethods: {
      associate: (models) => {
        QuestionTypes.hasMany(models.TestQuestions);
      }
    }
  });

  return QuestionTypes;
};
