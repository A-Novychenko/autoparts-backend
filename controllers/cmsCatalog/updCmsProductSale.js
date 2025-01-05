const { ASGProduct } = require('../../models/asg/products');

const { HttpError } = require('../../helpers');

const updCmsProductSale = async (req, res) => {
  const { id, sale } = req.body;

  const product = await ASGProduct.findOne({ id });

  if (!product) {
    throw HttpError(400);
  }

  const updProduct = await ASGProduct.findByIdAndUpdate(
    product._id,
    {
      sale,
    },
    { new: true },
  );

  res.json({
    status: 'OK',
    code: 200,
    updProduct,
  });
};

module.exports = updCmsProductSale;
