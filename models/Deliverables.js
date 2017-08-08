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
  });
  Deliverables.associate = (models) => {
    Deliverables.belongsTo(models.Events);
    Deliverables.belongsTo(models.DeliverableTemplates);
    Deliverables.belongsTo(models.Users, { as: 'Corrector' });
    Deliverables.belongsTo(models.Users, { as: 'Deputy' });
  };

  return Deliverables;
};
