const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { HttpError } = require('../../helpers');
const { User } = require('../../models/user');

const { SECRET_KEY } = process.env;

const login = async (req, res) => {
  const { login, password } = req.body;

  const user = await User.findOne({ login });

  if (!user) {
    throw HttpError(401, 'Login or password is invalid.');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, 'Login or password is invalid.');
  }

  const payload = { id: user._id };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' });

  const newUser = await User.findByIdAndUpdate(user._id, { token });

  res.json({
    status: 'OK',
    code: 200,
    token,
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
