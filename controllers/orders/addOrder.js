const { Order } = require('../../models/orders/order');

const { sendTg, sendEmail, normalizePhoneToLogin } = require('../../helpers');
const { Client } = require('../../models/clients/clients');
const { Shipment } = require('../../models/clients/shipments');

const { ADMIN_EMAIL, FRONTEND_URL } = process.env;

const makeMsgs = result => {
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
    <p>Товаров: ${result.products.length}шт на сумму:${result.totalAmountWithDiscount}грн</p>
    <p><a target="_blank" href="${FRONTEND_URL}/dashboard/orders/order/${result._id}">Открыть заказ </a></p>
    
    <p>Доставка: ${result.delivery === 'post' ? 'Новая Почта' : 'другое'} ${result.deliveryCity} №${result.postOffice}</p>
    
    ${result.message ? `<b>Сообщение: ${result.message}</b>` : ''}`,
  };

  const tgMsg = `<b>Новый заказ №${result.number}</b>\n
<b>Клиент: ${result.name} ${result.phone}</b>\n
<b>Доставка: ${result.delivery === 'post' ? 'Новая Почта' : 'другое'} ${result.deliveryCity} №${result.postOffice}</b>\n
${products}\n
<b>Сумма: ${result.totalAmountWithDiscount}грн</b> \n
${result.message ? `<b>Сообщение: ${result.message}</b>` : ''}`;

  return { newTransactionEmail, tgMsg };
};

const addOrder = async (req, res) => {
  const { name, phone, email, delivery, deliveryCity, postOffice, payment } =
    req.body;
  const login = normalizePhoneToLogin(phone);

  let client = await Client.findOne({ login });

  if (!client) {
    client = await Client.create({
      name,
      phone,
      email,
      login,
      password: '12345678',
    });
  }

  let shipmentId;

  const shipment = await Shipment.findOne({
    client: client._id,
    delivery,
    deliveryCity,
    postOffice,
    payment,
    name,
    phone,
  }).collation({ locale: 'uk', strength: 1 });

  if (!shipment) {
    const newShipment = await Shipment.create({
      client: client._id,
      delivery,
      deliveryCity,
      postOffice,
      payment,
      name,
      phone,
    });

    shipmentId = newShipment._id;
  } else {
    shipmentId = shipment._id;
  }

  const result = await Order.create({
    ...req.body,
    client: client._id,
    shipment: shipmentId,
  });

  const { tgMsg, newTransactionEmail } = makeMsgs(result);

  try {
    // await Promise.all([sendTg(tgMsg), sendEmail(newTransactionEmail)]);
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
