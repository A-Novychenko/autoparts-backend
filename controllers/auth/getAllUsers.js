const { User } = require('../../models/user');

const getAllUsers = async (req, res) => {
  const users = await User.find();

  res.json({
    status: 'Success',
    code: 200,
    users,
  });
};

module.exports = getAllUsers;
