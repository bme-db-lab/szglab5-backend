module.exports = (sequelize, DataTypes) => {
  const ExerciseTypes = sequelize.define('ExerciseTypes', {
    name: DataTypes.STRING,
    shortName: DataTypes.STRING,
    exerciseId: DataTypes.INTEGER
  });

  ExerciseTypes.associate = (models) => {
    ExerciseTypes.hasMany(models.ExerciseSheets);
    ExerciseTypes.hasMany(models.StudentRegistrations);
    ExerciseTypes.belongsToMany(models.Users, { through: 'UserExerciseTypes' });
    ExerciseTypes.belongsTo(models.Users, { as: 'Guru' });
    ExerciseTypes.belongsTo(models.Courses);
  };

  return ExerciseTypes;
};
