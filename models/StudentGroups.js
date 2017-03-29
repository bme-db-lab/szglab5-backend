module.exports = (sequelize, DataTypes) => {
  const StudentGroups = sequelize.define('StudentGroups', {
    name: DataTypes.STRING,
    language: DataTypes.STRING,
  }, {
    classMethods: {
      associate: (models) => {
        StudentGroups.belongsTo(models.Semesters);
        StudentGroups.hasMany(models.StudentRegistrations);
        // StudentGroups.hasMany(models.Staffs, {foreignKey: 'id', sourceKey: 'demonstrator'});
        // StudentGroups.hasMany(models.Semesters, {foreignKey: 'id', sourceKey: 'semester'});
        // StudentGroups.belongsTo(models.Appointments, {foreignKey: 'id', targetKey: 'studentgroup'});
        // StudentGroups.belongsTo(models.Events, {foreignKey: 'id', targetKey: 'studentgroup'});
      }
    }
  });

  return StudentGroups;
};
