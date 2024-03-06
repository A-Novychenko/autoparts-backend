const ASGCategory = require('../../models/asg/categories');

const getCategory = async (req, res) => {
  const { id } = req.query;

  console.log('id', id);

  const categories = await ASGCategory.find({ parent_id: id });

  console.log('categories', categories);

  res.json({
    status: 'OK',
    code: 200,
    categories,
  });
};

module.exports = getCategory;
