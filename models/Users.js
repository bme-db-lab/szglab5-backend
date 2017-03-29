module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    displayName: DataTypes.STRING,
    loginName: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    sshPublicKey: DataTypes.STRING,
    // Student specific attributes
    neptun: DataTypes.STRING,
    university: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => {
        Users.hasMany(models.StudentRegistrations);
      }
    }
  });

  return Users;
};
