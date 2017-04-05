module.exports = (sequelize, DataTypes) => {
  const Repositories = sequelize.define('Repositories', {
    id: { type: Sequelize.INTEGER, primaryKey: true },
    deadline: DataTypes.DATE,
    submitteddate: DataTypes.DATE,
    grade: DataTypes.INTEGER,
    comment: DataTypes.TEXT,
    deliverabletype: DataTypes.INTEGER,
    evaluator: DataTypes.INTEGER,
    related: DataTypes.INTEGER,
    url: DataTypes.TEXT,
    commit: DataTypes.TEXT
  }, {
    classMethods: {
      associate: (models) => {
        Repositories.hasMany(models.DeliverableTypes, {foreignKey: 'id', sourceKey: 'deliverabletype'});
        Repositories.hasMany(models.Staffs, {foreignKey: 'id', sourceKey: 'evaluator'});
        Repositories.hasMany(models.Repositories, {foreignKey: 'id', sourceKey: 'related'});
        Repositories.belongsTo(models.Repositories, {foreignKey: 'id', targetKey: 'related'});
      }
    }
  });

  return Repositories;
};
