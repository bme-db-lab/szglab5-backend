module.exports = (sequelize, DataTypes) => {
  const News = sequelize.define('News', {
    title: DataTypes.TEXT,
    text: DataTypes.TEXT,
    published: DataTypes.DATE,
    showFrom: DataTypes.DATE,
    showUntil: DataTypes.DATE,
    admins: DataTypes.BOOLEAN,
    students: DataTypes.BOOLEAN,
    demonstrators: DataTypes.BOOLEAN,
    evaluators: DataTypes.BOOLEAN,
    onLogin: DataTypes.BOOLEAN
  });

  News.associate = (models) => {
    News.belongsTo(models.Semesters);
    News.belongsTo(models.Users, { as: 'publisher' });
    News.belongsTo(models.Languages);
  };

  return News;
};
