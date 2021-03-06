module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    displayName: DataTypes.STRING,
    loginName: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    sshPublicKey: DataTypes.STRING,
    colorTheme: {
      type: DataTypes.STRING,
      defaultValue: 'blue-gray'
    },
    subscribedToMailList: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    subscribedToEmailNotify: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    gitlabUserid: DataTypes.INTEGER,
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
    initPassword: DataTypes.STRING
  });

  Users.associate = (models) => {
    Users.hasMany(models.StudentRegistrations);
    Users.hasMany(models.Deliverables, { foreignKey: 'CorrectorId' });
    // Users.hasMany(models.Deliverables, { foreignKey: 'DeputyId' });
    Users.hasMany(models.Events, { foreignKey: 'DemonstratorId' });
    Users.hasMany(models.StudentGroups);
    Users.belongsToMany(models.Roles, { through: 'UserRoles' });
    Users.belongsToMany(models.ExerciseTypes, { through: 'UserExerciseTypes' });
  };

  return Users;
};
