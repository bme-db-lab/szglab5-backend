module.exports = (sequelize, DataTypes) => {
  const Appointments = sequelize.define('Appointments', {
    date: DataTypes.DATE,
    location: DataTypes.TEXT,
    type: DataTypes.STRING,
  });

  Appointments.associate = (models) => {
    Appointments.hasMany(models.EventTemplates);
    Appointments.belongsTo(models.StudentGroups);
  };

  return Appointments;
};
