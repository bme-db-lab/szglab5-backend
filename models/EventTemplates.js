module.exports = (sequelize, DataTypes) => {
  const EventTemplates = sequelize.define('EventTemplates', {
    title: DataTypes.STRING
  });

  EventTemplates.associate = (models) => {
    EventTemplates.hasMany(models.ExerciseCategories);
    EventTemplates.hasMany(models.DeliverableTemplates);
  };

  return EventTemplates;
};
