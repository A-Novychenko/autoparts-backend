const getCurrentUser = async (req, res) => {
  const { user } = req;

  res.json({
    status: 'OK',
    code: 200,
    accessToken: user.accessToken,
    refreshToken: user.refreshToken,
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
