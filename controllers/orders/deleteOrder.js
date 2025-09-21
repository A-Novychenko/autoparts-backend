const { HttpError } = require('../../helpers');
const { Order } = require('../../models/orders/order');

const deleteOrder = async (req, res) => {
  const { id } = req.params;

  const order = await Order.findByIdAndDelete(id);

  if (!order) {
    throw HttpError(404);
  }

  res.status(200).json({
    status: 'success',
    code: 200,
    number: order.number,
  });
};

module.exports = deleteOrder;
