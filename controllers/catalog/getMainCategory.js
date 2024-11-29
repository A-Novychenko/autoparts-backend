const { ASGCategory } = require('../../models/asg/categories');

const getMainCategory = async (req, res) => {
  const categories = await ASGCategory.find({ parent_id: 0 }).sort({
    id: 1,
  });

  res.json({
    status: 'OK',
    code: 200,
    categories,
  });
};

module.exports = getMainCategory;
