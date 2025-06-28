const { transformedProductsBySite, HttpError } = require('../../helpers');

const ASGImage = require('../../models/asg/images');
const { ASGProduct } = require('../../models/asg/products');

const getOneProduct = async (req, res) => {
  const { id } = req.params;

  console.log('PRODUCT-ID: ', id);

  // const result = await ASGProduct.findById([id]);
  const result = await ASGProduct.findById(id);

  console.log('result', result);

  if (!result) {
    throw HttpError(404, 'product not found');
  }

  const imgResult = await ASGImage.findOne({ product_id: result.id });

  const img = imgResult ? imgResult.original_images : [];

  const [product] = transformedProductsBySite([result]);

  res.status(200).json({
    status: 'success',
    code: 200,
    data: { ...product, img },
  });
};

module.exports = getOneProduct;
