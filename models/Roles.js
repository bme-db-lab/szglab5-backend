module.exports = (sequelize, DataTypes) => {
  const Roles = sequelize.define('Roles', {
    roleName: DataTypes.TEXT,
  });

  Roles.associate = (models) => {
    Roles.belongsToMany(models.Users, { through: 'UserRoles' });
  };

  return Roles;
};
