module.exports = (sequelize, DataTypes) => {
  const Test = sequelize.define('Test', {
    title: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => {
        // Test.hasMany(models.TestQuestion, {as: 'questions'});
        Test.hasMany(models.TestQuestion, {as: 'questions'});
      }
    }
  });

  return Test;
};
