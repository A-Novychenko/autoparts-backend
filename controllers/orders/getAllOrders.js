const { Order } = require('../../models/orders/order');

const getAllOrders = async (req, res) => {
  const result = await Order.find({}).sort({ number: -1 });

  res.status(200).json({
    status: 'success',
    code: 200,

    orders: result,
  });
};

module.exports = getAllOrders;
