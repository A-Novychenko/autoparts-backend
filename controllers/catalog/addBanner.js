// const { ASGCategory } = require('../../models/asg/categories');

const addBanner = async (req, res) => {
  const { id } = req.body;

  //   const categories = await ASGCategory.findOne({ id });

  res.json({
    status: 'OK',
    code: 200,
    categories,
  });
};

module.exports = addBanner;
