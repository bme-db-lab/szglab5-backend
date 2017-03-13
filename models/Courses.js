module.exports = (sequelize, DataTypes) => {
  const Courses = sequelize.define('Courses', {
    id: DataTypes.INTEGER,
    name: DataTypes.TEXT,
    codename: DataTypes.TEXT
  }, {
    classMethods: {
      associate: (models) => {
        Courses.belongsTo(models.ExerciseCategories, {foreignKey: 'id', targetKey: 'course'});
        Courses.belongsTo(models.Semesters, {foreignKey: 'id', targetKey: 'course'});
      }
    }
  });

  return Courses;
};
