module.exports = (sequelize, DataTypes) => {
  const DeliverableTemplates = sequelize.define('DeliverableTemplates', {
    description: DataTypes.STRING,
    type: DataTypes.STRING
  });

  DeliverableTemplates.associate = (models) => {
    DeliverableTemplates.hasMany(models.Deliverables);
  };


  return DeliverableTemplates;
};
