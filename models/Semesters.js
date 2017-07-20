module.exports = (sequelize, DataTypes) => {
  const Semesters = sequelize.define('Semesters', {
    academicyear: DataTypes.STRING,
    academicterm: DataTypes.INTEGER,
    description: DataTypes.STRING,
  }, {
    classMethods: {
      associate: (models) => {
        Semesters.belongsTo(models.Courses);
        Semesters.hasMany(models.StudentRegistrations);
        Semesters.hasMany(models.StudentGroups);
      }
    }
  });

  return Semesters;
};
