module.exports = (sequelize, DataTypes) => {
  const Events = sequelize.define('Events', {
    id: DataTypes.INTEGER,
    date: DataTypes.DATE,
    location: DataTypes.TEXT,
    number: DataTypes.INTEGER,
    title: DataTypes.TEXT,
    attempt: DataTypes.INTEGER,
    shortdescription: DataTypes.TEXT,
    related: DataTypes.INTEGER,
    eventtype: DataTypes.INTEGER,
    exercisetype: DataTypes.INTEGER,
    demonstrator: DataTypes.INTEGER,
    student: DataTypes.INTEGER,
    studentgroup: Datatypes.INTEGER
  }, {
    classMethods: {
      associate: (models) => {
        Events.hasMany(models.Events, {foreignKey: 'id', sourceKey: 'related'});
        Events.hasMany(models.EventTypes, {foreignKey: 'id', sourceKey: 'eventtype'});
        Events.hasMany(models.ExerciseTypes, {foreignKey: 'id', sourceKey: 'exercisetype'});
        Events.hasMany(models.Staffs, {foreignKey: 'id', sourceKey: 'demonstrator'});
        Events.hasMany(models.Students, {foreignKey: 'id', sourceKey: 'student'});
        Events.hasMany(models.StudentGroups, {foreignKey: 'id', sourceKey: 'studentgroup'});
        Events.belongsTo(models.Events, {foreignKey: 'id', targetKey: 'related'});
      }
    }
  });

  return Events;
};
