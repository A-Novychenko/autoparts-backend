const { ASGProduct } = require('../../models/asg/products');

const getTotalProducts = async (req, res) => {
  const totalCount = await ASGProduct.countDocuments();

  res.json({
    status: 'OK',
    code: 200,
    totalPages: totalCount,
  });
};

module.exports = getTotalProducts;
