const { Order } = require('../../models/orders/order');

const getOrderStatus = async (req, res) => {
  const { id } = req.params;
  const result = await Order.findById(id);

  res.status(200).json({
    status: 'success',
    code: 200,
    data: result.status,
  });
};

module.exports = getOrderStatus;
