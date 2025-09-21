const { HttpError } = require('../../helpers');
const { Client } = require('../../models/clients/clients');
const { Order } = require('../../models/orders/order');

const accountingOrder = async (req, res) => {
  const { user } = req;
  const { id } = req.params;

  const order = await Order.findById(id).populate('client');
  if (!order) {
    throw HttpError(404, 'Order not found');
  }

  const {
    client,
    shipment,
    status,
    isPaid,
    isAccounted,
    totalAmountWithDiscount,
    products,
  } = order;

  if (!client) {
    throw HttpError(400, 'Client not selected');
  }
  if (!shipment) {
    throw HttpError(400, 'Client not selected');
  }
  if (status !== 'done') {
    throw HttpError(400, 'Order status not "Completed"');
  }
  if (isAccounted) {
    throw HttpError(400, 'Order already processed');
  }
  if (totalAmountWithDiscount < 0) {
    throw HttpError(400, 'Order amount cannot be 0 or less');
  }
  if (!isPaid) {
    throw HttpError(400, 'Order not paid');
  }
  if (products.length === 0) {
    throw HttpError(400, 'No products in the order');
  }

  await Client.findByIdAndUpdate(client._id, {
    $inc: { totalSpent: totalAmountWithDiscount },
  });

  const result = await Order.findByIdAndUpdate(
    id,
    {
      isAccounted: true,
      updatedBy: user.name,
    },
    { new: true },
  ).populate('client');

  res.status(200).json({
    status: 'success',
    code: 200,
    number: order.number,
    isAccounted: true,
    updTotalSpent: result.client.totalSpent,
    updatedBy: user.name,
  });
};

module.exports = accountingOrder;
