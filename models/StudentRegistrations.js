module.exports = (sequelize, DataTypes) => {
  const StudentRegistrations = sequelize.define('StudentRegistrations', {
    neptunSubjectCode: DataTypes.STRING,
    neptunCourseCode: DataTypes.STRING,
  }, {
    classMethods: {
      associate: (models) => {
        StudentRegistrations.belongsTo(models.Semesters);
        StudentRegistrations.belongsTo(models.StudentGroups);
        StudentRegistrations.hasMany(models.Events);
        StudentRegistrations.belongsTo(models.Users);
        // Semesters.belongsTo(models.RegisteredStaffs, { foreignKey: 'id', targetKey: 'semester' });
        // Semesters.belongsTo(models.RegisteredStudents, { foreignKey: 'id', targetKey: 'semester' });
        // Semesters.belongsTo(models.StudentGroups, { foreignKey: 'id', targetKey: 'semester' });
      }
    }
  });

  return StudentRegistrations;
};
