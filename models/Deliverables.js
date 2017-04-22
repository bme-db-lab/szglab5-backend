module.exports = (sequelize, DataTypes) => {
  const Deliverables = sequelize.define('Deliverables', {
    deadline: DataTypes.DATE,
    submitteddate: DataTypes.DATE,
    grade: DataTypes.INTEGER,
    comment: DataTypes.STRING,
    //
    url: DataTypes.STRING,
    commit: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => {
        Deliverables.belongsTo(models.Events);
        Deliverables.belongsTo(models.DeliverableTemplates);
        Deliverables.belongsTo(models.Users, { as: 'Corrector' });
      }
    }
  });

  return Deliverables;
};
