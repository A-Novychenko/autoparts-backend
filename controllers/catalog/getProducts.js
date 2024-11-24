// const ASGCategory = require('../../models/asg/categories');
const fetchImgs = require('../../helpers/fetchASGImgs');
const ASGProduct = require('../../models/asg/products');

const getProducts = async (req, res) => {
  const { id } = req.query;

  console.log('id', id);

  const products = await ASGProduct.find({ category_id: id }).limit(20);

  // const productsIds = products.map(({ id }) => id);
  // console.log('productsIds', productsIds);

  // const data = await fetchImgs(productsIds);

  // const imgs = data.data;

  // const productsWithImg = products.map(product => {
  //   const imgIdx = imgs.findIndex(
  //     ({ product_id }) => product_id === product.id,
  //   );

  //   if (imgIdx === -1) {
  //     return product;
  //   }

  //   const img = imgs[imgIdx].images[0];

  //   const productWithImg = { ...product._doc, img };

  //   return productWithImg;
  // });

  res.json({
    status: 'OK',
    code: 200,
    // products: productsWithImg,
    products,
  });
};

module.exports = getProducts;
