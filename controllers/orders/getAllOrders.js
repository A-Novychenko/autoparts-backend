const { Order } = require('../../models/orders/order');

const getAllOrders = async (req, res) => {
  const orders = await Order.find({})
    .populate('client')
    .populate('shipment')
    .sort({ number: -1 });

  res.status(200).json({
    status: 'success',
    code: 200,
    orders,
  });
};

module.exports = getAllOrders;
