module.exports = (sequelize, DataTypes) => {
  const Staffs = sequelize.define('Staffs', {
    id: DataTypes.INTEGER,
    title: DataTypes.TEXT,
    displayname: DataTypes.TEXT,
    loginname: DataTypes.TEXT,
    eppn: DataTypes.TEXT,
    email: DataTypes.TEXT,
    sshpublickey: DataTypes.TEXT,
    password: DataTypes.TEXT
  }, {
    classMethods: {
      associate: (models) => {
        Staffs.belongsTo(models.Deliverables, {foreignKey: 'id', targetKey: 'evaluator'});
        Staffs.belongsTo(models.Events, {foreignKey: 'id', targetKey: 'demonstrator'});
        Staffs.belongsTo(models.RegisteredStaffs, {foreignKey: 'id', targetKey: 'staff'});
        Staffs.belongsTo(models.StudentGroups, {foreignKey: 'id', targetKey: 'demonstrator'});
      }
    }
  });

  return Staffs;
};
