module.exports = (sequelize, DataTypes) => {
  const ExerciseCategories = sequelize.define('ExerciseCategories', {
    id: { type: Sequelize.INTEGER, primaryKey: true },
    type: DataTypes.TEXT,
    course: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: (models) => {
        ExerciseCategories.hasMany(models.Courses, {foreignKey: 'id', sourceKey: 'course'});
        ExerciseCategories.belongsTo(models.ExerciseTypes, {foreignKey: 'id', targetKey: 'exercisecategory'});
        ExerciseCategories.belongsTo(models.ExerciseSheets, {foreignKey: 'id', targetKey: 'excategory'});
        ExerciseCategories.belongsTo(models.Questions, {foreignKey: 'id', targetKey: 'excategory'});
      }
    }
  });

  return ExerciseCategories;
};