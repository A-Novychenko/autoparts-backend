const { Banner } = require('../../models/banner');

const getAllBanner = async (req, res) => {
  const products = await Banner.find();

  res.json({
    status: 'OK',
    code: 200,
    products,
  });
};

module.exports = getAllBanner;
