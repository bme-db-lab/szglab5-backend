module.exports = (sequelize, DataTypes) => {
  const EventTemplates = sequelize.define('EventTemplates', {
    title: DataTypes.STRING,
    number: DataTypes.INTEGER
  });

  EventTemplates.associate = (models) => {
    EventTemplates.hasMany(models.ExerciseCategories);
    EventTemplates.hasMany(models.DeliverableTemplates);
  };

  return EventTemplates;
};
