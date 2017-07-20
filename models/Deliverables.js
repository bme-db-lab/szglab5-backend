module.exports = (sequelize, DataTypes) => {
  const Deliverables = sequelize.define('Deliverables', {
    deadline: DataTypes.DATE,
    submitteddate: DataTypes.DATE,
    grading: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    grade: DataTypes.INTEGER,
    imsc: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    finalized: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    comment: DataTypes.STRING,
    //
    url: DataTypes.STRING,
    commit: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => {
        Deliverables.belongsTo(models.Events);
        Deliverables.belongsTo(models.DeliverableTemplates);
        Deliverables.belongsTo(models.Users, { as: 'Corrector', foreignKey: 'CorrectorName', targetKey: 'email_official' });
        Deliverables.belongsTo(models.Users, { as: 'Deputy', foreignKey: 'DeputyEmail', targetKey: 'email_official' });
      }
    }
  });

  return Deliverables;
};
