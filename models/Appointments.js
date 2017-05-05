module.exports = (sequelize, DataTypes) => {
  const Appointments = sequelize.define('Appointments', {
    date: DataTypes.DATE,
    location: DataTypes.TEXT,
    type: DataTypes.STRING,
    // eventtype: DataTypes.INTEGER,
    // studentgroup: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: (models) => {
        Appointments.belongsTo(models.EventTemplates);
        Appointments.belongsTo(models.StudentGroups);
        // Appointments.hasMany(models.EventTypes, {foreignKey: 'id', sourceKey: 'eventtype'});
        // Appointments.hasMany(models.StudentGroups, {foreignKey: 'id', sourceKey: 'studentgroup'});
      }
    }
  });

  return Appointments;
};
