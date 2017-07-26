module.exports = (sequelize, DataTypes) => {
  const EventTemplates = sequelize.define('EventTemplates', {
    title: DataTypes.STRING,
    number: DataTypes.INTEGER
  });

  EventTemplates.associate = (models) => {
    EventTemplates.hasMany(models.Events);
    EventTemplates.hasMany(models.Appointments);
  };

  return EventTemplates;
};
