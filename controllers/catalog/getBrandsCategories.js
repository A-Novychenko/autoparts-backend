const { ASGCategory } = require('../../models/asg/categories');

const getBrandsCategories = async (req, res) => {
  const categories = await ASGCategory.find();

  res.json({
    status: 'OK',
    code: 200,
    categories,
  });
};

module.exports = getBrandsCategories;
