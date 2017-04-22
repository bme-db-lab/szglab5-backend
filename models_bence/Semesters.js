module.exports = (sequelize, DataTypes) => {
  const Semesters = sequelize.define('Semesters', {
    id: { type: Sequelize.INTEGER, primaryKey: true },
    academicyear: DataTypes.INTEGER,
    academicterm: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    course: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: (models) => {
        Semesters.hasMany(models.Courses, {foreignKey: 'id', sourceKey: 'course'});
        Semesters.belongsTo(models.RegisteredStaffs, {foreignKey: 'id', targetKey: 'semester'});
        Semesters.belongsTo(models.RegisteredStudents, {foreignKey: 'id', targetKey: 'semester'});
        Semesters.belongsTo(models.StudentGroups, {foreignKey: 'id', targetKey: 'semester'});
      }
    }
  });

  return Semesters;
};
