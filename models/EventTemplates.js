module.exports = (sequelize, DataTypes) => {
  const EventTemplates = sequelize.define('EventTemplates', {
    title: DataTypes.STRING,
    number: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: (models) => {
        EventTemplates.hasMany(models.Events);
      }
    }
  });
  return EventTemplates;
};
