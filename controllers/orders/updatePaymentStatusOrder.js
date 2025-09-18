const { HttpError } = require('../../helpers');
const { Order } = require('../../models/orders/order');

const updatePaymentStatusOrder = async (req, res) => {
  const { id } = req.params;
  const { isPaid } = req.body;

  const order = await Order.findById(id);

  if (!order) {
    throw HttpError(404);
  }

  await Order.findByIdAndUpdate(id, { isPaid });

  res.status(200).json({
    code: 200,
    status: 'OK',
  });
};

module.exports = updatePaymentStatusOrder;
