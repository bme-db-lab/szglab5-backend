module.exports = (sequelize, DataTypes) => {
  const Events = sequelize.define('Events', {
    id: { type: Sequelize.INTEGER, primaryKey: true },
    date: DataTypes.DATE,
    location: DataTypes.TEXT,
    attempt: DataTypes.INTEGER,
    related: DataTypes.INTEGER,
    eventtype: DataTypes.INTEGER,
    exercisheet: DataTypes.INTEGER,
    demonstrator: DataTypes.INTEGER,
    studentreg: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: (models) => {
        Events.hasMany(models.Events, {foreignKey: 'id', sourceKey: 'related'});
        Events.hasMany(models.EventTemplates, {foreignKey: 'id', sourceKey: 'eventtype'});
        Events.hasMany(models.ExerciseSheets, {foreignKey: 'id', sourceKey: 'exercisheet'});
        Events.hasMany(models.Staff, {foreignKey: 'id', sourceKey: 'demonstrator'});
        Events.hasMany(models.StudentRegistrations, {foreignKey: 'id', sourceKey: 'studentreg'});
        Events.belongsTo(models.Events, {foreignKey: 'id', targetKey: 'related'});
        Events.belongsTo(models.DeliverableTemplates, {foreignKey: 'id', sourceKey: 'eventtype'});
      }
    }
  });

  return Events;
};
