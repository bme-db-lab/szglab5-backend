const Joi = require('joi');

module.exports = Joi.object().keys({
  text: Joi.string().required(),
  TestId: Joi.number()
});
