const jwt = require('jsonwebtoken');

const { User } = require('../models/user');

const { HttpError } = require('../helpers');

const { ACCESS_SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = '' } = req.headers;

  const [bearer, accessToken] = authorization.split(' ');

  if (bearer !== 'Bearer') {
    next(HttpError(401));
  }
  console.log('RRR');
  try {
    const { id } = jwt.verify(accessToken, ACCESS_SECRET_KEY);

    const user = await User.findById(id);

    if (
      !user ||
      !user.accessToken ||
      user.accessToken !== accessToken ||
      user.status !== 'enabled'
    ) {
      next(HttpError(401));
    }

    req.user = user;

    next();
  } catch {
    next(HttpError(401));
  }
};

module.exports = authenticate;
