module.exports = (sequelize, DataTypes) => {
  const Appointments = sequelize.define('Appointments', {
    date: DataTypes.DATE,
    location: DataTypes.TEXT
  });

  Appointments.associate = (models) => {
    Appointments.belongsTo(models.StudentGroups);
    Appointments.belongsTo(models.EventTemplates);
  };

  return Appointments;
};
