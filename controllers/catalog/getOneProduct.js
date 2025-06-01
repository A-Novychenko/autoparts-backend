const { transformedProductsBySite } = require('../../helpers');
const fetchImgs = require('../../helpers/fetchASGImgs');
const { ASGProduct } = require('../../models/asg/products');

const getOneProduct = async (req, res) => {
  const { id } = req.params;

  const result = await ASGProduct.findById([id]);

  const { data } = await fetchImgs([result.id]);

  const img = data[0]?.original_images[0] ? data[0]?.original_images : [];

  const [product] = transformedProductsBySite([result]);

  res.status(200).json({
    status: 'success',
    code: 200,
    data: { ...product, img },
  });
};

module.exports = getOneProduct;
