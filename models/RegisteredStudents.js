module.exports = (sequelize, DataTypes) => {
  const RegisteredStudents = sequelize.define('RegisteredStudents', {
    id: DataTypes.INTEGER,
    neptunsubjectcode: DataTypes.TEXT,
    neptuncoursecode: DataTypes.TEXT,
    student: DataTypes.INTEGER,
    semester: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: (models) => {
        RegisteredStudents.hasMany(models.Students, {foreignKey: 'id', sourceKey: 'student'});
        RegisteredStudents.hasMany(models.Semesters, {foreignKey: 'id', sourceKey: 'semester'});
      }
    }
  });

  return RegisteredStudents;
};
