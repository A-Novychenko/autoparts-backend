const { ASGCategory } = require('../../models/asg/categories');

const getCategoriesByParentId = async (req, res) => {
  const { id } = req.query;

  const categories = await ASGCategory.find({ parent_id: id });

  res.json({
    status: 'OK',
    code: 200,
    categories,
  });
};

module.exports = getCategoriesByParentId;
