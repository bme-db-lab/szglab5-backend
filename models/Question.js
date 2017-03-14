module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define('question', {
    text: DataTypes.STRING
  }, {
    classMethods: {
      // associate: (models) => {
      //   Question.belongsTo(models.Test);
      // }
    }
  });

  return Question;
};
