module.exports = (sequelize, DataTypes) => {
  const TestQuestion = sequelize.define('TestQuestion', {
    text: DataTypes.STRING
  }, {
    classMethods: {
    }
  });

  return TestQuestion;
};
