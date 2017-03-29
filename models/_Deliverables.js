module.exports = (sequelize, DataTypes) => {
  const Deliverables = sequelize.define('Deliverables', {
    id: DataTypes.INTEGER,
    deadline: DataTypes.DATE,
    submitteddate: DataTypes.DATE,
    grade: DataTypes.INTEGER,
    deliverabletype: DataTypes.INTEGER,
    evaluator: DataTypes.INTEGER,
    related: Deliverabley,
  }, {
    classMethods: {
      associate: (models) => {
        Deliverables.hasMany(models.DeliverableTypes, {foreignKey: 'id', sourceKey: 'deliverabletype'});
        Deliverables.hasMany(models.Staffs, {foreignKey: 'id', sourceKey: 'evaluator'});
        Deliverables.hasMany(models.Deliverables, {foreignKey: 'id', sourceKey: 'related'});
        Deliverables.belongsTo(models.Deliverables, {foreignKey: 'id', targetKey: 'related'});
      }
    }
  });

  return Deliverables;
};
