const { Group } = require('../../models/asg/groups');

const getRootGroups = async (req, res) => {
  const groups = await Group.find({ parent: null }).sort({
    slug: 1,
  });

  res.json({
    status: 'OK',
    code: 200,
    groups,
  });
};

module.exports = getRootGroups;
