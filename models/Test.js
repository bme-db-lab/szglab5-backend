module.exports = (sequelize, DataTypes) => {
  const Test = sequelize.define('Test', {
    title: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => {
        Test.belongsToMany(models.Question, { through: 'TestQuestion' });
      }
    }
  });

  return Test;
};
