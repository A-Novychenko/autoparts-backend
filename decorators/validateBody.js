const { HttpError } = require('../helpers');

const validateBody = schema => {
  const validate = (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      next(HttpError(400, error.message));
    }
    console.log('NEXT');
    next();
  };
  return validate;
};

module.exports = validateBody;
