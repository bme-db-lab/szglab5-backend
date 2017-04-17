module.exports = (sequelize, DataTypes) => {
  const Events = sequelize.define('Events', {
    date: DataTypes.DATE,
    location: DataTypes.STRING,
    attempt: DataTypes.INTEGER,
    comment: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => {
        Events.belongsTo(models.StudentRegistrations);
        Events.belongsTo(models.Users, { as: 'demonstrator' });
        Events.hasMany(models.Deliverables);
        Events.belongsTo(models.EventTemplates);
      }
    }
  });

  return Events;
};
