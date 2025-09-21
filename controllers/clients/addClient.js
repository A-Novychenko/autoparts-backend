const { normalizePhoneToLogin, HttpError } = require('../../helpers');
const { Client } = require('../../models/clients/clients');

const addClient = async (req, res) => {
  const { name, phone, email } = req.body;

  const login = normalizePhoneToLogin(phone);

  const client = await Client.findOne({ login });

  if (client) {
    throw HttpError(409, 'such a client already exists');
  }

  const newClient = await Client.create({
    name,
    phone,
    email,
    login,
    password: '12345678',
  });

  res.status(201).json({
    status: 'created',
    code: 201,
    newClient,
  });
};

module.exports = addClient;
