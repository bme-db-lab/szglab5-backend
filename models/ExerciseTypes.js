module.exports = (sequelize, DataTypes) => {
  const ExerciseTypes = sequelize.define('ExerciseTypes', {
    name: DataTypes.STRING,
    shortName: DataTypes.STRING,
    language: DataTypes.STRING,
  });

  ExerciseTypes.associate = (models) => {
    ExerciseTypes.hasMany(models.ExerciseSheets);
    ExerciseTypes.belongsToMany(models.Users, { through: 'UserExerciseTypes' });
  };

  return ExerciseTypes;
};
