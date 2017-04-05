module.exports = (sequelize, DataTypes) => {
  const RegisteredStudents = sequelize.define('RegisteredStudents', {
    id: { type: Sequelize.INTEGER, primaryKey: true },
    neptunsubjectcode: DataTypes.TEXT,
    neptuncoursecode: DataTypes.TEXT,
    student: DataTypes.INTEGER,
    studentgroup: DataTypes.INTEGER,
    semester: DataTypes.INTEGER,
    language: DataTypes.TEXT
  }, {
    classMethods: {
      associate: (models) => {
        RegisteredStudents.hasMany(models.Students, {foreignKey: 'id', sourceKey: 'student'});
        RegisteredStudents.hasMany(models.StudentGroups, {foreignKey: 'id', sourceKey: 'studentgroup'});
        RegisteredStudents.hasMany(models.Semesters, {foreignKey: 'id', sourceKey: 'semester'});
        RegisteredStudents.hasOne(models.Languages, {foreignKey: 'language', sourceKey: 'language'});
      }
    }
  });

  return RegisteredStudents;
};
