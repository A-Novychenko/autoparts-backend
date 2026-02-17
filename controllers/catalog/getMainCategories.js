const { ASGCategory } = require('../../models/asg/categories');

const getMainCategories = async (req, res) => {
  const categories = await ASGCategory.find({
    parent_id: 0,
    id: { $ne: 889 }, //убирает категорию ШИНЫ
  }).sort({
    id: 1,
  });

  res.json({
    status: 'OK',
    code: 200,
    categories,
  });
};

module.exports = getMainCategories;
