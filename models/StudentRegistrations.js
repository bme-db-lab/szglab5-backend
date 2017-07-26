module.exports = (sequelize, DataTypes) => {
  const StudentRegistrations = sequelize.define('StudentRegistrations', {
    neptunSubjectCode: DataTypes.STRING,
    neptunCourseCode: DataTypes.STRING,
  });

  StudentRegistrations.associate = (models) => {
    StudentRegistrations.belongsTo(models.Semesters);
    StudentRegistrations.hasMany(models.Events);
    StudentRegistrations.belongsTo(models.Users, { targetKey: 'neptun' });
    StudentRegistrations.belongsTo(models.StudentGroups);
  };

  return StudentRegistrations;
};
