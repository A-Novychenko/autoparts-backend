const { HttpError } = require('../../helpers');
const { User } = require('../../models/user');

const changeStatus = async (req, res) => {
  const { status, id } = req.body;

  const result = await User.find({ _id: id });

  if (!result) {
    throw HttpError(404, 'user not found');
  }

  const updateUser = await User.findByIdAndUpdate(
    id,
    { status },
    { new: true },
  );

  res.json({
    status: 'Success',
    code: 200,
    user: updateUser,
  });
};

module.exports = changeStatus;
