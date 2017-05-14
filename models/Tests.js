module.exports = (sequelize, DataTypes) => {
  const Tests = sequelize.define('Tests', {
    title: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    classMethods: {
      associate: (models) => {
        Tests.hasMany(models.TestQuestions);
      }
    }
  });

  return Tests;
};
