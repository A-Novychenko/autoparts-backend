const { Group } = require('../../models/asg/groups');

const getCmsAllGroups = async (req, res) => {
  const groups = await Group.find().sort({ 'ancestors.length': 1, name: 1 });

  res.json({
    status: 'OK',
    code: 200,

    groups,
  });
};

module.exports = getCmsAllGroups;
