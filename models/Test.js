module.exports = (sequelize, DataTypes) => {
  const Test = sequelize.define('Test', {
    title: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => {
        Test.hasMany(models.Question);
        Test.belongsTo(models.Language);
      }
    }
  });

  return Test;
};
