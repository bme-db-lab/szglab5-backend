module.exports = (sequelize, DataTypes) => {
  const Students = sequelize.define('Students', {
    id: { type: Sequelize.INTEGER, primaryKey: true },
    title: DataTypes.TEXT,
    displayname: DataTypes.TEXT,
    loginname: DataTypes.TEXT,
    eppn: DataTypes.TEXT,
    email: DataTypes.TEXT,
    sshpublickey: DataTypes.TEXT,
    password: DataTypes.TEXT,
    neptun: DataTypes.TEXT,
    university: DataTypes.TEXT
  }, {
    classMethods: {
      associate: (models) => {
        Students.belongsTo(models.Events, {foreignKey: 'id', targetKey: 'student'});
        Students.belongsTo(models.RegisteredStudents, {foreignKey: 'id', targetKey: 'student'});
      }
    }
  });

  return Students;
};
