const { User } = require('../../models/user');

const getAllUsers = async (req, res) => {
  const users = await User.find({ login: { $ne: 'admin' } });

  res.json({
    status: 'OK',
    code: 200,
    users,
  });
};

module.exports = getAllUsers;
