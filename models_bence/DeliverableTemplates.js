module.exports = (sequelize, DataTypes) => {
  const DeliverableTemplates = sequelize.define('DeliverableTemplates', {
    id: { type: Sequelize.INTEGER, primaryKey: true },
    deadline: DataTypes.DATE,
    description: DataTypes.TEXT,
    eventtype: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: (models) => {
        DeliverableTemplates.hasMany(models.Events, {foreignKey: 'id', sourceKey: 'eventtype'});
        DeliverableTemplates.belongsTo(models.Deliverables, {foreignKey: 'id', targetKey: 'deliverabletype'});
      }
    }
  });

  return DeliverableTemplates;
};
