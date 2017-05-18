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
    // TODO temporary role management
    role: DataTypes.STRING,
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

  }, {
    classMethods: {
      associate: (models) => {
        Users.hasMany(models.StudentRegistrations, { sourceKey: 'neptun' });
        Users.hasMany(models.Deliverables, { foreignKey: 'Corrector', sourceKey: 'email_official' });
        Users.hasMany(models.Events, { foreignKey: 'Demonstrator', sourceKey: 'email_official' });
        Users.hasMany(models.StudentGroups, { foreignKey: 'Demonstrator', sourceKey: 'email_official' });
        Users.belongsTo(models.ExerciseTypes, { foreignKey: 'OwnedExerciseId' });
      }
    }
  });

  return Users;
};
