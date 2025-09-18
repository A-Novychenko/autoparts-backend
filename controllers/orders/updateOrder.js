const { HttpError } = require('../../helpers');
const { Client } = require('../../models/clients/clients');
const { Order } = require('../../models/orders/order');

const updateOrder = async (req, res) => {
  const { id } = req.params;
  const newStatus = req.body?.status;

  const order = await Order.findById(id).populate('client');
  if (!order) {
    throw HttpError(404, 'Order not found');
  }

  const { client, status, totalAmountWithDiscount } = order;

  if (client) {
    if (newStatus === 'done' && status !== 'done') {
      await Client.findByIdAndUpdate(client._id, {
        $inc: { totalSpent: totalAmountWithDiscount },
      });
    } else if (status === 'done' && newStatus !== 'done') {
      await Client.findByIdAndUpdate(client._id, {
        $inc: { totalSpent: -totalAmountWithDiscount },
      });
    }
  }

  await Order.findByIdAndUpdate(id, { ...req.body });

  res.status(200).json({ status: 'success', code: 200 });
};

module.exports = updateOrder;
