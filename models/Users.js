module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    id: DataTypes.INTEGER,
    title: DataTypes.TEXT,
    displayname: DataTypes.TEXT,
    loginname: DataTypes.TEXT,
    eppn: DataTypes.TEXT,
    email: DataTypes.TEXT,
    sshpublickey: DataTypes.TEXT,
    password: DataTypes.TEXT
  });

  return Users;
};
