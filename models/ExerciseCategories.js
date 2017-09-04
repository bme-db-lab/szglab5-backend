module.exports = (sequelize, DataTypes) => {
  const ExerciseCategories = sequelize.define('ExerciseCategories', {
    type: DataTypes.STRING
  });

  ExerciseCategories.associate = (models) => {
    ExerciseCategories.hasMany(models.ExerciseSheets);
    ExerciseCategories.hasMany(models.Questions);
    ExerciseCategories.belongsTo(models.Courses);
    ExerciseCategories.hasOne(models.EventTemplates);
  };

  return ExerciseCategories;
};
