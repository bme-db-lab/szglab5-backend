const Joi = require('joi');

module.exports = Joi.object().keys({
  title: Joi.string().required(),
  LanguageId: Joi.string()
});
