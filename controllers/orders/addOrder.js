const { Order } = require('../../models/orders/order');

const { sendTg, sendEmail } = require('../../helpers');

const { ADMIN_EMAIL, FRONTEND_URL } = process.env;

const addOrder = async (req, res) => {
  const result = await Order.create({ ...req.body });

  const calculateTotals = items => ({
    totalAmountWithDiscount: items.reduce(
      (sum, item) => sum + (item.price_promo || item.price) * item.quantity,
      0,
    ),
    totalDiscount: items.reduce(
      (sum, item) =>
        sum +
        (item.price_promo ? item.price - item.price_promo : 0) * item.quantity,
      0,
    ),
    totalAmount: items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    ),
  });

  const { totalAmountWithDiscount } = calculateTotals(result.products);

  const newTransactionEmail = {
    to: ADMIN_EMAIL,
    subject: `Новый заказ:${result.number}`,
    html: `<p>Новый заказ:${result.number}</p>
    <p>Пользователь: ${result.name} Телефон:${result.phone}</p>
    <p>Товаров: ${result.products.length}шт на сумму:${totalAmountWithDiscount}</p>
    <p><a target="_blank" href="${FRONTEND_URL}/dashboard/orders/order/${result._id}">Открыть заказ </a></p>`,
  };

  try {
    await sendTg(`<b>Новый заказ №${result.number}</b>`);
    await sendEmail(newTransactionEmail);
  } catch (e) {
    console.log('e', e);
  }

  res.status(201).json({
    status: 'created',
    code: 201,
    data: result,
  });
};

module.exports = addOrder;
