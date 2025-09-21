const { HttpError } = require('../../helpers');

const { Order } = require('../../models/orders/order');

const updateOrder = async (req, res) => {
  const { user } = req;
  const { id } = req.params;

  const order = await Order.findById(id).populate('client');
  if (!order) {
    throw HttpError(404, 'Order not found');
  }

  const result = await Order.findByIdAndUpdate(
    id,
    {
      ...req.body,
      updatedBy: user.name,
    },
    { new: true },
  ).populate('client');

  res.status(200).json({
    status: 'success',
    code: 200,
    updStatus: result.status,
    updatedBy: user.name,
  });
};

module.exports = updateOrder;
