const cloudinary = require('cloudinary').v2;

const { Group } = require('../../models/asg/groups');

const updateGroupImg = async (req, res) => {
  const { _id } = req.body;

  const group = await Group.findById(_id);

  let groupImg = group.img;
  if (req.file) {
    if (groupImg !== '') {
      const urlSliced = groupImg.slice(62, groupImg.length - 4);
      await cloudinary.uploader.destroy(urlSliced, {
        invalidate: true,
        resource_type: 'image',
      });
    }
    groupImg = req.file.path;
  }

  const updGroup = await Group.findByIdAndUpdate(
    _id,
    { img: groupImg },
    { new: true },
  );

  res.json({
    status: 'OK',
    code: 200,
    group: updGroup,
  });
};

module.exports = updateGroupImg;
