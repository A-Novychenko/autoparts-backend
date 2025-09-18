const { HttpError } = require('../../helpers');
const { Order } = require('../../models/orders/order');

const delProduct = async (req, res) => {
  const { id, productId } = req.params;

  console.log('id', id);
  console.log('productId', productId);

  const order = await Order.findById(id);
  if (!order) {
    throw HttpError(404, 'Order not found');
  }

  const hasProduct = Boolean(
    order.products.find(({ _id }) => _id.toString() === productId.toString()),
  );

  console.log('hasProduct', hasProduct);
  const updProducts = order.products.filter(
    ({ _id }) => _id.toString() !== productId.toString(),
  );

  await Order.findByIdAndUpdate(id, { products: updProducts });

  res.status(200).json({
    status: 'success',
    code: 200,
  });
};

module.exports = delProduct;
