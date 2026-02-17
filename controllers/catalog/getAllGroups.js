const { Group } = require('../../models/asg/groups');

const getAllGroups = async (req, res) => {
  const groups = await Group.find().sort({
    id: 1,
  });

  res.json({
    status: 'OK',
    code: 200,
    groups,
  });
};

module.exports = getAllGroups;
