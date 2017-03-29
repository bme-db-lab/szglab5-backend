module.exports = (sequelize, DataTypes) => {
  const EventTypes = sequelize.define('EventTypes', {
    id: DataTypes.INTEGER,
    type: DataTypes.TEXT,
    number: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: (models) => {
        EventTypes.belongsTo(models.Appointments, {foreignKey: 'id', targetKey: 'eventtype'});
        EventTypes.belongsTo(models.Events, {foreignKey: 'id', targetKey: 'eventtype'});
      }
    }
  });

  return EventTypes;
};
