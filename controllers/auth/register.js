const bcrypt = require('bcrypt');

const { User } = require('../../models/user');
const { HttpError } = require('../../helpers');

const register = async (req, res) => {
  const { login, password } = req.body;

  const user = await User.findOne({ login });

  if (user) {
    throw HttpError(409, 'This login cannot be registered, try another one');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...req.body, password: hashPassword });

  res.status(201).json({
    status: 'created',
    code: 201,
    user: {
      _id: newUser._id,
      name: newUser.name,
      login: newUser.login,
      role: newUser.role,
      status: newUser.status,
    },
  });
};

module.exports = register;
