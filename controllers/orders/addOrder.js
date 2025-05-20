const { Order } = require('../../models/orders/order');

const addOrder = async (req, res) => {
  const result = await Order.create({ ...req.body });

  res.status(201).json({
    status: 'created',
    code: 201,
    data: result,
  });
};

module.exports = addOrder;
