module.exports = (sequelize, DataTypes) => {
  const TestQuestions = sequelize.define('TestQuestions', {
    text: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    classMethods: {
      associate: (models) => {
        //TestQuestions.belongsTo(models.QuestionTypes);
        TestQuestions.belongsTo(models.Tests);
      }
    }
  });

  return TestQuestions;
};
