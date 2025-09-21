const { HttpError } = require('../../helpers');
const { Order } = require('../../models/orders/order');

const editPriceAndQtyOrder = async (req, res) => {
  const { user } = req;
  const { id } = req.params;
  const { quantity, price_promo, productId, comment } = req.body;

  const order = await Order.findById(id).populate('client');
  if (!order) {
    throw HttpError(404, 'Order not found');
  }

  const products = order.products.map(p => {
    if (String(p._id) !== String(productId)) {
      return p;
    }

    return { ...(p.toObject?.() || p), price_promo, quantity, comment };
  });

  const totalAmountWithDiscount = products.reduce(
    (acc, el) =>
      acc + (el.price_promo ? el.price_promo : el.price) * el.quantity,
    0,
  );

  const totalAmount = products.reduce(
    (acc, el) => acc + el.price * el.quantity,
    0,
  );

  const totalDiscount = totalAmount - totalAmountWithDiscount;

  const updOrder = await Order.findByIdAndUpdate(
    id,
    {
      products,
      totalAmount,
      totalAmountWithDiscount,
      totalDiscount,
      updatedBy: user.name,
    },
    { new: true },
  );

  res.status(200).json({
    status: 'success',
    code: 200,
    updOrder,
  });
};

module.exports = editPriceAndQtyOrder;
