const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require('../../models/user');

const { HttpError } = require('../../helpers');

const { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } = process.env;

const login = async (req, res) => {
  const { login, password } = req.body;

  const user = await User.findOne({ login });

  if (!user || user.status !== 'enabled') {
    throw HttpError(401, 'Login or password is invalid.');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, 'Login or password is invalid.');
  }

  const payload = { id: user._id };

  const accessToken = jwt.sign(payload, ACCESS_SECRET_KEY, { expiresIn: '2m' });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, {
    expiresIn: '7d',
  });

  const newUser = await User.findByIdAndUpdate(user._id, {
    accessToken,
    refreshToken,
  });

  res.json({
    status: 'OK',
    code: 200,
    accessToken,
    refreshToken,
    user: {
      _id: newUser._id,
      name: newUser.name,
      login: newUser.login,
      role: newUser.role,
      status: newUser.status,
    },
  });
};

module.exports = login;
