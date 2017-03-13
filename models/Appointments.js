module.exports = (sequelize, DataTypes) => {
  const Appointments = sequelize.define('Appointments', {
    id: DataTypes.INTEGER,
    date: DataTypes.DATE,
    location: DataTypes.TEXT,
    eventtype: DataTypes.INTEGER,
    studentgroup: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: (models) => {
        Appointments.hasMany(models.EventTypes, {foreignKey: 'id', sourceKey: 'eventtype'});
        Appointments.hasMany(models.StudentGroups, {foreignKey: 'id', sourceKey: 'studentgroup'});
      }
    }
  });

  return Appointments;
};
