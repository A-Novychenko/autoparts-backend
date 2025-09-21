const { HttpError } = require('../../helpers');
const { Order } = require('../../models/orders/order');

const delProduct = async (req, res) => {
  const { user } = req;
  const { id, productId } = req.params;

  const order = await Order.findById(id);
  if (!order) {
    throw HttpError(404, 'Order not found');
  }

  const hasProduct = Boolean(
    order.products.find(({ _id }) => _id.toString() === productId.toString()),
  );

  if (!hasProduct) {
    throw HttpError(404, 'Product in this order not found');
  }

  const products = order.products.filter(
    ({ _id }) => _id.toString() !== productId.toString(),
  );

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

  await Order.findByIdAndUpdate(
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
    products,
    orderData: {
      totalAmount,
      totalAmountWithDiscount,
      totalDiscount,
      updatedBy: user.name,
    },
  });
};

module.exports = delProduct;
