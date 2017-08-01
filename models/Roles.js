module.exports = (sequelize, DataTypes) => {
  const Roles = sequelize.define('Roles', {
    name: DataTypes.TEXT,
  });

  Roles.associate = (models) => {
    Roles.belongsToMany(models.Users, { through: 'UserRoles' });
  };

  return Roles;
};
