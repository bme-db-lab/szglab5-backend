module.exports = (sequelize, DataTypes) => {
  const Test = sequelize.define('Test', {
    title: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => {
        Test.hasMany(models.Questions);
        Test.belongsTo(models.Languages);
      }
    }
  });

  return Test;
};
