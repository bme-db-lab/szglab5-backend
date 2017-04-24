module.exports = (sequelize, DataTypes) => {
  const ExerciseSheets = sequelize.define('ExerciseSheets', {
  }, {
    classMethods: {
      associate: (models) => {
        ExerciseSheets.belongsTo(models.ExerciseCategories);
        ExerciseSheets.belongsTo(models.ExerciseTypes);
        ExerciseSheets.hasMany(models.Events);
      }
    }
  });

  return ExerciseSheets;
};