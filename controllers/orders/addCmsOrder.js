const { Order } = require('../../models/orders/order');

const addCmsOrder = async (req, res) => {
  const { user } = req;
  const newOrder = await Order.create({
    totalAmount: 0,
    totalAmountWithDiscount: 0,
    totalDiscount: 0,
    createdBy: user.name,
    updatedBy: user.name,
  });

  const order = await Order.findById(newOrder._id).populate([
    'client',
    'shipment',
  ]);

  res.status(201).json({
    status: 'created',
    code: 201,
    order,
  });
};

module.exports = addCmsOrder;
