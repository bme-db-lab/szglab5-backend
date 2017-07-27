module.exports = (sequelize, DataTypes) => {
  const News = sequelize.define('News', {
    title: DataTypes.TEXT,
    text: DataTypes.TEXT,
    published: DataTypes.DATE,
    from: DataTypes.DATE,
    until: DataTypes.DATE,
    // TODO
    flags: DataTypes.INTEGER
  });

  News.associate = (models) => {
    News.belongsTo(models.Semesters);
  };

  return News;
};
