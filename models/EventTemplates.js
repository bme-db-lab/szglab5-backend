module.exports = (sequelize, DataTypes) => {
  const EventTemplates = sequelize.define('EventTemplates', {
    type: DataTypes.STRING,
    seqNumber: DataTypes.INTEGER
  });

  EventTemplates.associate = (models) => {
    EventTemplates.belongsTo(models.ExerciseCategories);
    EventTemplates.hasMany(models.DeliverableTemplates);
    EventTemplates.hasMany(models.Events);
  };

  return EventTemplates;
};
