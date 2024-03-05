const ASGCategory = require('../../models/asg/categories');

const getParentCategory = async (req, res) => {
  const categories = await ASGCategory.find();

  const parentIds = categories.map(({ parent_id }) => parent_id);
  const uniqueParentIds = [...new Set(parentIds)];

  console.log('uniqueParentIds', uniqueParentIds);

  // const sortedCategories = categories.map()

  res.json({ data: uniqueParentIds });
};

module.exports = getParentCategory;
