module.exports = (sequelize, DataTypes) => {
  const StudentGroups = sequelize.define('StudentGroups', {
    name: { type: DataTypes.STRING, unique: true },
    language: DataTypes.STRING,
  });

  StudentGroups.associate = (models) => {
    StudentGroups.belongsTo(models.Semesters);
    StudentGroups.hasMany(models.StudentRegistrations);
    StudentGroups.hasMany(models.Appointments);
    StudentGroups.belongsTo(models.Users);
  };

  return StudentGroups;
};
