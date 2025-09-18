const { HttpError } = require('../../helpers');
const { Order } = require('../../models/orders/order');

const chooseShipmentOrder = async (req, res) => {
  const { id } = req.params;
  const { shipmentId } = req.body;

  const order = await Order.findById(id);

  if (!order) {
    throw HttpError(404);
  }

  const updOrder = await Order.findByIdAndUpdate(
    id,
    { shipment: shipmentId },
    { new: true },
  )
    .populate('client')
    .populate('shipment');

  res.status(200).json({
    code: 200,
    status: 'OK',
    order: updOrder,
  });
};

module.exports = chooseShipmentOrder;
