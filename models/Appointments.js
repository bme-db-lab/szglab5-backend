module.exports = (sequelize, DataTypes) => {
  const Appointments = sequelize.define('Appointments', {
    date: DataTypes.DATE,
    location: DataTypes.TEXT,
    type: DataTypes.STRING,
    // eventtype: DataTypes.INTEGER,
    // studentgroup: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: (models) => {
        //Appointments.hasMany(models.EventTemplates, { foreignKey: 'id', sourceKey: 'eventtype' });
        Appointments.belongsTo(models.StudentGroups);
      }
    }
  });

  return Appointments;
};
