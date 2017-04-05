module.exports = (sequelize, DataTypes) => {
  const Appointments = sequelize.define('Appointments', {
    id: { type: Sequelize.INTEGER, primaryKey: true },
    date: DataTypes.DATE,
    location: DataTypes.TEXT,
    eventtype: DataTypes.INTEGER,
    studentgroup: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: (models) => {
        Appointments.hasMany(models.EventTemplates, {foreignKey: 'id', sourceKey: 'eventtype'});
        Appointments.hasMany(models.StudentGroups, {foreignKey: 'id', sourceKey: 'studentgroup'});
      }
    }
  });

  return Appointments;
};
