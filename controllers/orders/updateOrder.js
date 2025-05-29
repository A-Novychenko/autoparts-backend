const { Order } = require('../../models/orders/order');

const updateOrder = async (req, res) => {
  const { id } = req.params;

  await Order.findByIdAndUpdate(id, { ...req.body });

  res.status(200).json({
    status: 'success',
    code: 200,
  });
};
module.exports = updateOrder;
