module.exports = (sequelize, DataTypes) => {
  const QuestonType = sequelize.define('QuestionType', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => {
        QuestonType.hasMany(models.Question, { as: 'questionType' });
      }
    }
  });

  return QuestonType;
};
