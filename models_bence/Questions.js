module.exports = (sequelize, DataTypes) => {
  const Questions = sequelize.define('Questions', {
    kerdes: DataTypes.TEXT,
    language: DataTypes.TEXT,
    excategory: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: (models) => {
        Questions.hasOne(models.Languages, {foreignKey: 'language', sourceKey: 'language'});
        Questions.hasOne(models.ExerciseCategories, {foreignKey: 'id', sourceKey: 'excategory'});
      }
    }
  });

  return Questions;
};
