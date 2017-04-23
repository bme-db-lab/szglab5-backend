module.exports = (sequelize, DataTypes) => {
  const ExerciseTypes = sequelize.define('ExerciseTypes', {
    name: DataTypes.STRING,
    shortName: DataTypes.STRING,
    language: DataTypes.STRING,
  }, {
    classMethods: {
      associate: (models) => {
        ExerciseTypes.hasMany(models.ExerciseSheets);
      }
    }
  });

  return ExerciseTypes;
};
