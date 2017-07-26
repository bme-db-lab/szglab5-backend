module.exports = (sequelize, DataTypes) => {
  const Questions = sequelize.define('Questions', {
    text: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  });

  Questions.associate = (models) => {
  };

  return Questions;
};
