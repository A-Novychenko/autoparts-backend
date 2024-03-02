const { HttpError } = require('../../helpers');
const { User } = require('../../models/user');

const register = async (req, res) => {
  const { login, password } = req.body;

  const user = await User.findOne({ login });

  if (user) {
    throw HttpError(409, 'This login cannot be registered, try another one');
  }

  const newUser = await User.create({ ...req.body });
  console.log('newUser', newUser);

  res.status(201).json({
    status: 'created',
    code: 201,
    user: newUser,
  });
};

module.exports = register;
