module.exports = (sequelize, DataTypes) => {
  const Semesters = sequelize.define('Semesters', {
    academicyear: DataTypes.STRING,
    academicterm: DataTypes.INTEGER,
    description: DataTypes.STRING,
  });

  Semesters.associate = (models) => {
    Semesters.belongsTo(models.Courses);
    Semesters.hasMany(models.StudentRegistrations);
    Semesters.hasMany(models.StudentGroups);
    Semesters.hasMany(models.News);
  };

  return Semesters;
};
