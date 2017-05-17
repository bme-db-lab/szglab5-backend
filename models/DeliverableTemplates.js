module.exports = (sequelize, DataTypes) => {
  const DeliverableTemplates = sequelize.define('DeliverableTemplates', {
    description: DataTypes.STRING,
  }, {
    classMethods: {
      associate: (models) => {
        DeliverableTemplates.hasMany(models.Deliverables);
      }
    }
  });

  return DeliverableTemplates;
};
