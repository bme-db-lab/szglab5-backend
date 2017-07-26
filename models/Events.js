module.exports = (sequelize, DataTypes) => {
  const Events = sequelize.define('Events', {
    date: DataTypes.DATE,
    location: DataTypes.STRING,
    attempt: DataTypes.INTEGER,
    comment: DataTypes.STRING
  });

  Events.associate = (models) => {
    Events.belongsTo(models.StudentRegistrations);
    Events.belongsTo(models.Users, { as: 'Demonstrator', foreignKey: 'DemonstratorEmail', targetKey: 'email_official' });
    Events.hasMany(models.Deliverables);
    Events.belongsTo(models.EventTemplates);
    Events.belongsTo(models.ExerciseSheets);
  };
  return Events;
};
