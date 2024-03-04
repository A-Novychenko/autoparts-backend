const { HttpError } = require('../../helpers');

const getCurrentUser = async (req, res) => {
  const { user } = req;

  res.json({
    message: 'OK',
    code: 200,
    token: user.token,
    user: {
      _id: user._id,
      name: user.name,
      login: user.login,
      role: user.role,
      status: user.status,
    },
  });
};

module.exports = getCurrentUser;
