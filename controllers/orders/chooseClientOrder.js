const { HttpError } = require('../../helpers');
const { Order } = require('../../models/orders/order');

const chooseClientOrder = async (req, res) => {
  const { user } = req;
  const { id } = req.params;
  const { clientId } = req.body;

  const order = await Order.findById(id);

  if (!order) {
    throw HttpError(404);
  }

  const updOrder = await Order.findByIdAndUpdate(
    id,
    {
      client: clientId,
      updatedBy: user.name,
    },

    { new: true },
  )
    .populate('client')
    .populate('shipment');

  res.status(200).json({
    code: 200,
    status: 'OK',
    order: updOrder,
    updatedBy: user.name,
    client: updOrder.client,
  });
};

module.exports = chooseClientOrder;
