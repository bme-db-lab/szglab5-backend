module.exports = (sequelize, DataTypes) => {
  const Deliverables = sequelize.define('Deliverables', {
    id: { type: Sequelize.INTEGER, primaryKey: true },
    deadline: DataTypes.DATE,
    submitteddate: DataTypes.DATE,
    grade: DataTypes.INTEGER,
    comment: DataTypes.TEXT,
    deliverabletype: DataTypes.INTEGER,
    evaluator: DataTypes.INTEGER,
    related: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: (models) => {
        Deliverables.hasMany(models.DeliverableTemplates, {foreignKey: 'id', sourceKey: 'deliverabletype'});
        Deliverables.hasMany(models.Staff, {foreignKey: 'id', sourceKey: 'evaluator'});
        Deliverables.hasMany(models.Deliverables, {foreignKey: 'id', sourceKey: 'related'});
        Deliverables.belongsTo(models.Deliverables, {foreignKey: 'id', targetKey: 'related'});
      }
    }
  });

  return Deliverables;
};
