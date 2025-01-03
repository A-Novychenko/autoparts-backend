const { ASGProduct } = require('../../models/asg/products');

const { HttpError } = require('../../helpers');

const updCmsProductBanner = async (req, res) => {
  const { id, banner } = req.body;

  const product = await ASGProduct.findOne({ id });

  if (!product) {
    throw HttpError(400);
  }

  const updProduct = await ASGProduct.findByIdAndUpdate(
    product._id,
    {
      banner,
    },
    { new: true },
  );

  res.json({
    status: 'OK',
    code: 200,
    updProduct,
  });
};

module.exports = updCmsProductBanner;
