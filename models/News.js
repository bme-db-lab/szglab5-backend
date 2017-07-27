module.exports = (sequelize, DataTypes) => {
  const News = sequelize.define('News', {
    title: DataTypes.TEXT,
    text: DataTypes.TEXT,
    published: DataTypes.DATE,
    from: DataTypes.DATE,
    until: DataTypes.DATE,
    admins: DataTypes.BOOLEAN,
    students: DataTypes.BOOLEAN,
    demonstators: DataTypes.BOOLEAN,
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
