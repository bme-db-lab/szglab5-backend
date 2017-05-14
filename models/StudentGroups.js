module.exports = (sequelize, DataTypes) => {
  const StudentGroups = sequelize.define('StudentGroups', {
    name: { type: DataTypes.STRING, unique: true, primaryKey: true },
    language: DataTypes.STRING,
  }, {
    classMethods: {
      associate: (models) => {
        StudentGroups.belongsTo(models.Semesters);
        StudentGroups.hasMany(models.StudentRegistrations);
        StudentGroups.hasMany(models.Appointments);
      }
    }
  });

  return StudentGroups;
};
