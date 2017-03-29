module.exports = (sequelize, DataTypes) => {
  const ExerciseCategories = sequelize.define('ExerciseCategories', {
    id: DataTypes.INTEGER,
    type: DataTypes.TEXT,
    course: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: (models) => {
        ExerciseCategories.hasMany(models.Courses, {foreignKey: 'id', sourceKey: 'course'});
        ExerciseCategories.belongsTo(models.ExerciseTypes, {foreignKey: 'id', targetKey: 'exercisecategory'});
      }
    }
  });

  return ExerciseCategories;
};