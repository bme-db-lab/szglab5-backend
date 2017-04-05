module.exports = (sequelize, DataTypes) => {
  const Staff = sequelize.define('Staff', {
    id: { type: Sequelize.INTEGER, primaryKey: true },
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
        Staff.belongsTo(models.Deliverables, {foreignKey: 'id', targetKey: 'evaluator'});
        Staff.belongsTo(models.Events, {foreignKey: 'id', targetKey: 'demonstrator'});
        Staff.belongsTo(models.RegisteredStaffs, {foreignKey: 'id', targetKey: 'staff'});
        Staff.belongsTo(models.StudentGroups, {foreignKey: 'id', targetKey: 'demonstrator'});
        Staff.belongsTo(models.News, {foreignKey: 'id', targetKey: 'author'});
      }
    }
  });

  return Staff;
};
