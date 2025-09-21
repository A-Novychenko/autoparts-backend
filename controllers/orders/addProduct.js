const { default: mongoose } = require('mongoose');
const { HttpError } = require('../../helpers');
const { Order } = require('../../models/orders/order');

const addProduct = async (req, res) => {
  const { user } = req;
  const { id } = req.params;
  const product = req.body;

  const order = await Order.findById(id);
  if (!order) {
    throw HttpError(404, 'Order not found');
  }

  const newProduct =
    product._id === ''
      ? { ...product, _id: new mongoose.Types.ObjectId().toString() }
      : product;

  const products = [...order.products, newProduct];

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
    products: updOrder.products,
    orderData: {
      totalAmount,
      totalAmountWithDiscount,
      totalDiscount,
      updatedBy: user.name,
    },
  });
};

module.exports = addProduct;
