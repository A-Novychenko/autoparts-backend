const { VinRequest } = require('../../models/orders/vin-request');

const { sendTg, sendEmail } = require('../../helpers');

const { ADMIN_EMAIL, FRONTEND_URL } = process.env;

const addVinRequest = async (req, res) => {
  const result = await VinRequest.create({ ...req.body });

  const newTransactionEmail = {
    to: ADMIN_EMAIL,
    subject: `Новый VIN-запрос:${result.number}`,
    html: `<p>Новый VIN-запрос:${result.number}</p>
    ${result.name ? `<p>Пользователь: ${result.name}</p>` : null}
    <p>Телефон:${result.phone}</p>
    <p>: Vin:${result.vinCode}</p>
    <p>: Сообщение:${result.message}</p>
 
    <p><a target="_blank" href="${FRONTEND_URL}/dashboard/orders/vin-request/${result._id}">Открыть VIn-запрос </a></p>`,
  };

  try {
    await sendTg(`<b>Новый VIN-запрос №${result.number}</b>`);
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

module.exports = addVinRequest;
