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
  const products = result?.products
    ? result.products
        .map(({ brand, article, price, quantity }) => {
          return `<b>${brand} ${article} ${price}грн x ${quantity}шт</b>\n`;
        })
        .join('')
    : '';
  const mailProducts = result?.products
    ? result.products
        .map(({ brand, article, price, quantity }) => {
          return `<li><p>${brand} ${article} ${price}грн x ${quantity}шт</p></li>\n`;
        })
        .join('')
    : '';

  const newTransactionEmail = {
    to: ADMIN_EMAIL,
    subject: `Новый заказ:${result.number}`,
    html: `<p>Новый заказ:${result.number}</p>
    <p>Пользователь: ${result.name} Телефон:${result.phone}</p>
    <ul>${mailProducts}</ul>
    <p>Товаров: ${result.products.length}шт на сумму:${totalAmountWithDiscount}грн</p>
    <p><a target="_blank" href="${FRONTEND_URL}/dashboard/orders/order/${result._id}">Открыть заказ </a></p>
    
    <p>Доставка: ${result.delivery === 'post' ? 'Новая Почта' : 'другое'} ${result.deliveryCity} №${result.postOffice}</p>
    
    ${result.message ? `<b>Сообщение: ${result.message}</b>` : ''}`,
  };

  const tgMsg = `<b>Новый заказ №${result.number}</b>\n
<b>Клиент: ${result.name} ${result.phone}</b>\n
<b>Доставка: ${result.delivery === 'post' ? 'Новая Почта' : 'другое'} ${result.deliveryCity} №${result.postOffice}</b>\n
${products}\n
<b>Сумма: ${totalAmountWithDiscount}грн</b> \n
${result.message ? `<b>Сообщение: ${result.message}</b>` : ''}`;

  try {
    await Promise.all([sendTg(tgMsg), sendEmail(newTransactionEmail)]);
    // await sendTg(tgMsg);
    // await sendEmail(newTransactionEmail);
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
