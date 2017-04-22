module.exports = (sequelize, DataTypes) => {
  const Courses = sequelize.define('Courses', {
    name: DataTypes.STRING,
    codeName: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => {
        // Courses.belongsTo(models.ExerciseCategories, {foreignKey: 'id', targetKey: 'course'});
        Courses.hasMany(models.Semesters);
      }
    }
  });
  return Courses;
};
