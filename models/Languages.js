module.exports = (sequelize, DataTypes) => {
  const Languages = sequelize.define('Languages', {
  }, {
    classMethods: {
      associate: (models) => {
        Languages.hasMany(models.Questions);
        Languages.hasMany(models.ExerciseTypes);
        Languages.hasMany(models.StudentRegistrations);
        Languages.hasMany(models.News);
      }
    }
  });

  return Languages;
};
