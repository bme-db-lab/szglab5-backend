const Joi = require('joi');

const postReqSchema = Joi.object().keys({
  data: Joi.object().keys({
    attributes: Joi.object(),
    type: Joi.string().required(),
    relationships: Joi.object()
  })
});

module.exports = (app) => {
  app.post('*', (req, res, next) => {
    const data = req.body;
    const { error } = Joi.validate(data, postReqSchema);
    if (error) {
      res.status(400).send({ errors: [error] });
      return;
    }
    next();
  });
};
