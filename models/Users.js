module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    displayName: DataTypes.STRING,
    loginName: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    sshPublicKey: DataTypes.STRING,
    colorTheme: {
      type: DataTypes.STRING,
      defaultValue: 'blue-gray'
    },
    subscribedToMailList: DataTypes.BOOLEAN,
    subscribedToEmailNotify: DataTypes.BOOLEAN,
    // Student specific attributes
    neptun: { type: DataTypes.STRING, unique: true },
    university: DataTypes.STRING,
    // Staff specific attributes
    email_official: { type: DataTypes.STRING, unique: true },
    mobile: DataTypes.STRING,
    title: DataTypes.STRING,
    printSupport: DataTypes.STRING,
    classroom: DataTypes.STRING,
    spec: DataTypes.STRING,
    exercises: DataTypes.STRING
  });

  Users.associate = (models) => {
    Users.hasMany(models.StudentRegistrations, { sourceKey: 'neptun' });
    Users.hasMany(models.Deliverables, { foreignKey: 'CorrectorEmail', sourceKey: 'email_official' });
    Users.hasMany(models.Deliverables, { foreignKey: 'DeputyEmail', sourceKey: 'email_official' });
    Users.hasMany(models.Events, { foreignKey: 'DemonstratorEmail', sourceKey: 'email_official' });
    Users.hasMany(models.StudentGroups, { foreignKey: 'Demonstrator', sourceKey: 'email_official' });
    Users.belongsToMany(models.Roles, { through: 'UserRoles' });
    Users.belongsToMany(models.ExerciseTypes, { through: 'UserExerciseTypes' });
  };

  return Users;
};
