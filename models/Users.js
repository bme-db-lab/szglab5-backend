module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    displayName: DataTypes.STRING,
    loginName: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    sshPublicKey: DataTypes.STRING,
    // Student specific attributes
    neptun: DataTypes.STRING,
    university: DataTypes.STRING,
	// Staff specific attributes
	email_official: DataTypes.STRING,
	mobile: DataTypes.STRING,
	title: DataTypes.STRING,
	printSupport: DataTypes.STRING,
	// temporary attributes
	studentgroup_id: DataTypes.STRING,
	classroom: DataTypes.STRING,
	spec: DataTypes.STRING,
	exercises: DataTypes.STRING,
	ownedExerciseID: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => {
        Users.hasMany(models.StudentRegistrations);
        Users.hasMany(models.Deliverables);
      }
    }
  });

  return Users;
};
