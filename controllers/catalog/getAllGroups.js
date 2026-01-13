const { Group } = require('../../models/asg/groups');

const getAllGroups = async (req, res) => {
  // const response = await Group.find();
  const groups = await Group.find().sort({ 'ancestors.length': 1, name: 1 });

  res.json({
    status: 'OK',
    code: 200,
    // groups: response,
    groups,
  });
};

module.exports = getAllGroups;
