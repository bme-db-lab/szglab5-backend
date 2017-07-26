module.exports = (sequelize, DataTypes) => {
  const News = sequelize.define('News', {
    text: DataTypes.TEXT,
    published: DataTypes.DATE,
    from: DataTypes.DATE,
    until: DataTypes.DATE,
    // TODO
    flags: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: (models) => {
        News.belongsTo(models.Semesters);
      }
    }
  });

  return News;
};