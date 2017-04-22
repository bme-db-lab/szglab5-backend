module.exports = (sequelize, DataTypes) => {
  const News = sequelize.define('News', {
    newstext: DataTypes.TEXT,
    published: DataTypes.DATE,
    from: DataTypes.DATE,
    until: DataTypes.DATE,
    flags: DataTypes.INTEGER,
    language: DataTypes.TEXT,
    author: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: (models) => {
        News.hasOne(models.Languages, {foreignKey: 'language', sourceKey: 'language'});
        News.hasOne(models.Staff, {foreignKey: 'id', sourceKey: 'author'});
      }
    }
  });

  return News;
};
