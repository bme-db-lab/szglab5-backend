module.exports = (sequelize, DataTypes) => {
  const DeliverableTemplates = sequelize.define('DeliverableTemplates', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
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
