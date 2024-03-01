const { HttpError } = require('../helpers');

const validateBody = schema => {
  const wrap = (req, res, next) => {
    const err = schema.validate(req.body);

    if (err) next(HttpError(400, err.message));

    next();
  };

  return wrap;
};

module.exports = validateBody;
