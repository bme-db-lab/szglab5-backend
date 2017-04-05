module.exports = (sequelize, DataTypes) => {
  const ExerciseTypes = sequelize.define('ExerciseTypes', {
    id: { type: Sequelize.INTEGER, primaryKey: true },
    name: DataTypes.TEXT,
    shortname: DataTypes.TEXT,
    exerciseid: DataTypes.INTEGER,
    codename: DataTypes.TEXT,
    language: DataTypes.TEXT,
    exercisecategory: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: (models) => {
        ExerciseTypes.hasMany(models.ExerciseCategories, {foreignKey: 'id', sourceKey: 'exercisecategory'});
        ExerciseTypes.belongsTo(models.Events, {foreignKey: 'id', targetKey: 'exercisetype'});
        ExerciseTypes.belongsTo(models.ExerciseSheets, {foreignKey: 'id', targetKey: 'extype'});
      }
    }
  });

  return ExerciseTypes;
};
