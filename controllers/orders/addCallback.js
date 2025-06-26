const { Callback } = require('../../models/orders/callback');

const { sendTg, sendEmail, formatDateToUkrainian } = require('../../helpers');

const { ADMIN_EMAIL } = process.env;

const addCallback = async (req, res) => {
  const { phone } = req.body;
  const result = await Callback.create({ phone });

  const newTransactionEmail = {
    to: ADMIN_EMAIL,
    subject: `Заказан обратный звонок. Запрос: №${result.number}`,
    html: `<p>Заказан обратный звонок. Запрос: №${result.number}</p>
        <p>Телефон:${result.phone}</p>
        <p>Запрос создан:${formatDateToUkrainian(result.createdAt)}</p>
        `,
  };

  const tgMsg = `<b>Заказан обратный звонок.</b>\n<b>Запрос: №${result.number}</b>\n<b>Телефон: ${result.phone}</b>\n<b>Запрос создан: ${formatDateToUkrainian(result.createdAt)}</b>`;

  try {
    await sendTg(tgMsg);
    await sendEmail(newTransactionEmail);
  } catch (e) {
    console.log('e', e);
  }

  res.status(201).json({
    status: 'created',
    code: 201,
  });
};

module.exports = addCallback;
