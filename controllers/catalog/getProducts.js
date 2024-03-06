// const ASGCategory = require('../../models/asg/categories');
const ASGProduct = require('../../models/asg/products');

const getProducts = async (req, res) => {
  const { id } = req.query;

  console.log('id', id);

  const products = await ASGProduct.find({ category_id: id });

  res.json({
    status: 'OK',
    code: 200,
    products,
  });
};

module.exports = getProducts;
