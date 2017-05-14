module.exports = (sequelize, DataTypes) => {
  const Appointments = sequelize.define('Appointments', {
    date: DataTypes.DATE,
    location: DataTypes.TEXT,
    type: DataTypes.STRING,
  }, {
    classMethods: {
      associate: (models) => {
        Appointments.belongsTo(models.EventTemplates);
        Appointments.belongsTo(models.StudentGroups);
      }
    }
  });

  return Appointments;
};
