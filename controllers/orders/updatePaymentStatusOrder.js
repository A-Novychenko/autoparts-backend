const { HttpError } = require('../../helpers');
const { Order } = require('../../models/orders/order');

const updatePaymentStatusOrder = async (req, res) => {
  const { user } = req;
  const { id } = req.params;
  const { isPaid } = req.body;

  const order = await Order.findById(id);

  if (!order) {
    throw HttpError(404);
  }

  await Order.findByIdAndUpdate(id, {
    isPaid,
    updatedBy: user.name,
  });

  res.status(200).json({
    code: 200,
    status: 'OK',
    isPaid,
    updatedBy: user.name,
  });
};

module.exports = updatePaymentStatusOrder;
