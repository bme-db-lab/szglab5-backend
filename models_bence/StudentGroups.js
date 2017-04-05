module.exports = (sequelize, DataTypes) => {
  const StudentGroups = sequelize.define('StudentGroups', {
    id: { type: Sequelize.INTEGER, primaryKey: true },
    name: DataTypes.TEXT,
    demonstrator: DataTypes.INTEGER,
    semester: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: (models) => {
        StudentGroups.hasMany(models.Staff, {foreignKey: 'id', sourceKey: 'demonstrator'});
        StudentGroups.hasMany(models.Semesters, {foreignKey: 'id', sourceKey: 'semester'});
        StudentGroups.belongsTo(models.Appointments, {foreignKey: 'id', targetKey: 'studentgroup'});
        StudentGroups.belongsTo(models.Events, {foreignKey: 'id', targetKey: 'studentgroup'});
        StudentGroups.belongsTo(models.StudentRegistrations, {foreignKey: 'id', targetKey: 'studentgroup'});
      }
    }
  });

  return StudentGroups;
};
