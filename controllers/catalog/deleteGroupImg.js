const { HttpError } = require('../../helpers');
const { Group } = require('../../models/asg/groups');

const deleteGroupImg = async (req, res) => {
  const { id } = req.params;

  console.log('id', id);

  const groupe = await Group.findById(id);

  if (!groupe) {
    throw HttpError(404, 'Group not found');
  }

  await Group.findByIdAndUpdate(id, { ...groupe, img: '' });

  res.json({
    status: 'OK',
    code: 204,
  });
};

module.exports = deleteGroupImg;
