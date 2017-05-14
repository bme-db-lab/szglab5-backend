module.exports = (sequelize, DataTypes) => {
  const Courses = sequelize.define('Courses', {
    name: DataTypes.STRING,
    codeName: { type: DataTypes.STRING, primaryKey: true }
  }, {
    classMethods: {
      associate: (models) => {
        Courses.hasMany(models.ExerciseCategories);
        Courses.hasMany(models.Semesters);
      }
    }
  });
  return Courses;
};
