module.exports = (sequelize, DataTypes) => {
  const Test = sequelize.define('test', {
    title: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => {
        Test.hasMany(models.question);
        Test.belongsTo(models.language);
      }
    }
  });

  return Test;
};
