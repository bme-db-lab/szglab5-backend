module.exports = (sequelize, DataTypes) => {
  const DeliverableTypes = sequelize.define('DeliverableTypes', {
    id: DataTypes.INTEGER,
    type: DataTypes.TEXT,
    deadline: DataTypes.DATE,
    description: DataTypes.TEXT,
    eventtype: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: (models) => {
        DeliverableTypes.hasMany(models.Events, {foreignKey: 'id', sourceKey: 'evemttype'});
        DeliverableTypes.belongsTo(models.Deliverables, {foreignKey: 'id', targetKey: 'deliverabletype'});
      }
    }
  });

  return DeliverableTypes;
};
