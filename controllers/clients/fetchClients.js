const { Client } = require('../../models/clients/clients');

const fetchClients = async (req, res) => {
  const clients = await Client.find();

  return res.status(200).json({
    status: 'OK',
    code: 200,
    clients,
  });
};

module.exports = fetchClients;
