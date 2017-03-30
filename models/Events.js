module.exports = (sequelize, DataTypes) => {
  const Events = sequelize.define('Events', {
    date: DataTypes.DATE,
    location: DataTypes.STRING,
    attempt: DataTypes.INTEGER,
  }, {
    classMethods: {
      associate: (models) => {
        Events.belongsTo(models.StudentRegistrations);
        Events.hasMany(models.Deliverables);
        // Events.hasMany(models.Events, {foreignKey: 'id', sourceKey: 'related'});
        // Events.hasMany(models.EventTypes, {foreignKey: 'id', sourceKey: 'eventtype'});
        // Events.hasMany(models.ExerciseTypes, {foreignKey: 'id', sourceKey: 'exercisetype'});
        // Events.hasMany(models.Staffs, {foreignKey: 'id', sourceKey: 'demonstrator'});
        // Events.hasMany(models.Students, {foreignKey: 'id', sourceKey: 'student'});
        // Events.hasMany(models.StudentGroups, {foreignKey: 'id', sourceKey: 'studentgroup'});
        // Events.belongsTo(models.Events, {foreignKey: 'id', targetKey: 'related'});
      }
    }
  });

  return Events;
};
