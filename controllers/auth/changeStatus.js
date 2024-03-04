const { HttpError } = require('../../helpers');
const { User } = require('../../models/user');

const changeStatus = async (req, res) => {
  const { status, id } = req.body;

  console.log('status', status);

  const result = await User.find({ _id: id });

  if (!result) {
    throw HttpError(404, 'user not found');
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { status },
    { new: true },
  );

  res.json({
    status: 'OK',
    code: 200,
    user: updatedUser,
  });
};

module.exports = changeStatus;
