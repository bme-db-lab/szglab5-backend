module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define('Question', {
    text: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => {
        Question.belongsToMany(models.Test, { through: 'TestQuestion' });
      }
    }
  });

  return Question;
};
