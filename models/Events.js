module.exports = (sequelize, DataTypes) => {
  const Events = sequelize.define('Events', {
    date: DataTypes.DATE,
    location: DataTypes.STRING,
    attempt: DataTypes.INTEGER,
    grade: DataTypes.INTEGER,
    finalized: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    comment: DataTypes.STRING
  });

  Events.associate = (models) => {
    Events.belongsTo(models.StudentRegistrations);
    Events.belongsTo(models.Users, { as: 'Demonstrator' });
    Events.hasMany(models.Deliverables);
    Events.belongsTo(models.ExerciseSheets);
    Events.belongsTo(models.EventTemplates);
  };
  return Events;
};
