module.exports = (sequelize, DataTypes) => {
  const Courses = sequelize.define('Courses', {
    name: DataTypes.STRING,
    codeName: { type: DataTypes.STRING }
  });

  Courses.associate = (models) => {
    Courses.hasMany(models.ExerciseCategories);
    Courses.hasMany(models.Semesters);
    Courses.hasMany(models.ExerciseTypes);
  };

  return Courses;
};
