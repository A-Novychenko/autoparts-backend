const { Order } = require('../../models/orders/order');

const getOneOrder = async (req, res) => {
  const { id } = req.params;

  const order = await Order.findById(id)
    .populate('client')
    .populate('shipment');

  res.status(200).json({
    status: 'success',
    code: 200,
    order,
  });
};

module.exports = getOneOrder;
