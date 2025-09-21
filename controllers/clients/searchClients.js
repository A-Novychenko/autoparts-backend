const { normalizePhoneToLogin, HttpError } = require('../../helpers');
const { Client } = require('../../models/clients/clients');

const searchClients = async (req, res) => {
  const { phone, name, clientCode } = req.query;

  const filter = {};

  if (phone) {
    // нормализуем телефон для поиска
    const normalizedPhone = normalizePhoneToLogin(phone);
    filter.login = normalizedPhone;
  }

  if (name) {
    // поиск по имени (частичное совпадение, регистронезависимый)
    filter.name = { $regex: name, $options: 'i' };
  }

  if (clientCode) {
    filter.clientCode = { $regex: clientCode, $options: 'i' }; // частичный поиск по коду
  }

  if (Object.keys(filter).length === 0) {
    throw HttpError(400, 'No query parameter passed');
  }

  // const clients = await Client.find(filter).limit(20); // лимит для безопасности
  const clients = await Client.find(filter);

  res.status(200).json({
    status: 'OK',
    code: 200,
    clients,
  });
};

module.exports = searchClients;
