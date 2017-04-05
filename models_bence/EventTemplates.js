module.exports = (sequelize, DataTypes) => {
  const EventTemplates = sequelize.define('EventTemplates', {
    id: { type: Sequelize.INTEGER, primaryKey: true },
    title: DataTypes.TEXT,
    number: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: (models) => {
        EventTypes.belongsTo(models.Appointments, {foreignKey: 'id', targetKey: 'eventtype'});
        EventTypes.belongsTo(models.Events, {foreignKey: 'id', targetKey: 'eventtype'});
      }
    }
  });

  return EventTemplates;
};
