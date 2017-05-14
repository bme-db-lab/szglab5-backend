module.exports = (sequelize, DataTypes) => {
  const ExerciseCategories = sequelize.define('ExerciseCategories', {
    type: DataTypes.STRING,
  }, {
    classMethods: {
      associate: (models) => {
        ExerciseCategories.hasMany(models.ExerciseSheets);
        ExerciseCategories.belongsTo(models.Courses);
      }
    }
  });

  return ExerciseCategories;
};
