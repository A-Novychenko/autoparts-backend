const { serviceASG } = require('../../helpers');
const ASGProduct = require('../../models/asg/products');

const getAllProductsASG = async (req, res) => {
  const { page } = req.query;
  // const { data } = await serviceASG.post(`/prices?page=${page}`);

  //забрать и дописать товары из ASG
  //http:localhost:3005/api/asg/prices?page=101
  //   const result = await ASGProduct.create(data.data.items);

  res.json({ status: 'OK', code: 200, products: data.data.items });
};

module.exports = getAllProductsASG;
