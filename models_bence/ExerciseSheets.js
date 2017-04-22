module.exports = (sequelize, DataTypes) => {
  const ExerciseSheets = sequelize.define('ExerciseSheets', {
    excategory: DataTypes.INTEGER,
    extype: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: (models) => {
        ExerciseSheets.hasMany(models.ExerciseCategories, {foreignKey: 'id', sourceKey: 'excategory'});
        ExerciseSheets.hasMany(models.ExerciseTypes, {foreignKey: 'id', sourceKey: 'extype'});
      }
    }
  });

  return ExerciseSheets;
};