const { HttpError } = require('../../helpers');

const getUser = async (req, res) => {
  if (false) {
    throw HttpError(404, `User with id:${req.params.id}`);
  }

  res.json({
    message: 'Success',
    user: { _id: 'fff2fs23dfd', role: 'admin', name: 'Admin' },
  });
};

module.exports = getUser;
