const { ASGProduct } = require('../../models/asg/products');
const { Banner } = require('../../models/banner');

const { HttpError } = require('../../helpers');

const addBanner = async (req, res) => {
  const { id, price, price_sale, img } = req.body;

  console.log('id', id);
  console.log('price_sale', price_sale);

  const result = await ASGProduct.findOne({ id });

  if (!result) {
    throw HttpError(404);
  }

  const product = {
    id: result.id,
    cid: result.cid,
    category: result.category,
    category_id: result.category_id,
    brand: result.brand,
    article: result.article,
    tecdoc_article: result.tecdoc_article,
    name: result.name,
    description: result.description,
    price,
    price_sale,
    count_warehouse_3: result.count_warehouse_3,
    img,
  };

  const isExist = await Banner.findOne({ id });

  if (!isExist) {
    await Banner.create(product);
  } else {
    await Banner.findByIdAndUpdate(isExist._id, product);
  }

  res.json({
    status: 'OK',
    code: 200,
    product,
  });
};

module.exports = addBanner;
