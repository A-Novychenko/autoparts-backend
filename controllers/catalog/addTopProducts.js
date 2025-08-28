const { TopProduct } = require('../../models/orders/topProducts');

const addTopProducts = async (req, res) => {
  const response = await TopProduct.create({ ...req.body });

  res.json({
    status: 'OK',
    code: 200,
    id: response,
  });
};

module.exports = addTopProducts;
