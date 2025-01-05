const { ASGProduct } = require('../../models/asg/products');

const { HttpError } = require('../../helpers');

const updCmsProductPricePromo = async (req, res) => {
  const { id, price_promo } = req.body;

  const product = await ASGProduct.findOne({ id });

  if (!product) {
    throw HttpError(400);
  }

  const updProduct = await ASGProduct.findByIdAndUpdate(
    product._id,
    {
      price_promo,
    },
    { new: true },
  );

  res.json({
    status: 'OK',
    code: 200,
    updProduct,
  });
};

module.exports = updCmsProductPricePromo;
