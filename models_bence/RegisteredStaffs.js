module.exports = (sequelize, DataTypes) => {
  const RegisteredStaffs = sequelize.define('RegisteredStaffs', {
    id: { type: Sequelize.INTEGER, primaryKey: true },
    isadmin: DataTypes.BOOLEAN,
    isdemonstrator: DataTypes.BOOLEAN,
    staff: DataTypes.INTEGER,
    semester: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: (models) => {
        RegisteredStaffs.hasMany(models.Staff, {foreignKey: 'id', sourceKey: 'staff'});
        RegisteredStaffs.hasMany(models.Semesters, {foreignKey: 'id', sourceKey: 'semester'});
      }
    }
  });

  return RegisteredStaffs;
};
