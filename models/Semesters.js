module.exports = (sequelize, DataTypes) => {
  const Semesters = sequelize.define('Semesters', {
    academicyear: DataTypes.INTEGER,
    academicterm: DataTypes.INTEGER,
    description: DataTypes.STRING,
  }, {
    classMethods: {
      associate: (models) => {
        Semesters.belongsTo(models.Courses);
        Semesters.hasMany(models.StudentRegistrations);
        Semesters.hasMany(models.StudentGroups);
        // Semesters.belongsTo(models.RegisteredStaffs, { foreignKey: 'id', targetKey: 'semester' });
        // Semesters.belongsTo(models.RegisteredStudents, { foreignKey: 'id', targetKey: 'semester' });
        // Semesters.belongsTo(models.StudentGroups, { foreignKey: 'id', targetKey: 'semester' });
      }
    }
  });

  return Semesters;
};