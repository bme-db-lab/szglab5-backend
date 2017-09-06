module.exports = (sequelize, DataTypes) => {
  const DeliverableTemplates = sequelize.define('DeliverableTemplates', {
    description: DataTypes.STRING,
    type: DataTypes.STRING,
    name: DataTypes.STRING,
    AKEP: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  DeliverableTemplates.associate = (models) => {
    DeliverableTemplates.hasMany(models.Deliverables);
    DeliverableTemplates.belongsTo(models.EventTemplates);
  };

  return DeliverableTemplates;
};
