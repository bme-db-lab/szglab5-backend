module.exports = (sequelize, DataTypes) => {
  const Language = sequelize.define('language', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => {
        Language.hasMany(models.test);
      }
    }
  });

  return Language;
};
