module.exports = (sequelize, DataTypes) => {
  const Languages = sequelize.define('Languages', {
    language: DataTypes.TEXT
  }, {
    classMethods: {
      associate: (models) => {
        Languages.belongsTo(models.StudentRegistrations, {foreignKey: 'language', targetKey: 'language'});
        Languages.belongsTo(models.Questions, {foreignKey: 'language', targetKey: 'language'});
        Languages.belongsTo(models.News, {foreignKey: 'language', targetKey: 'language'});
      }
    }
  });

  return Languages;
};
