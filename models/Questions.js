module.exports = (sequelize, DataTypes) => {
  const Questions = sequelize.define('Questions', {
    text: DataTypes.STRING
  });

  Questions.associate = (models) => {
    Questions.belongsTo(models.ExerciseCategories);
    Questions.belongsTo(models.Languages);
  };

  return Questions;
};
