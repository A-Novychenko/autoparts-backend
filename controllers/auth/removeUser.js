const { User } = require('../../models/user');

const removeUser = async (req, res) => {
  const { id } = req.params;

  const user = await User.findByIdAndDelete(id);

  if (!user) {
    throw HttpError(404, 'Not found');
  }

  res.status(204).end();
};

module.exports = removeUser;
