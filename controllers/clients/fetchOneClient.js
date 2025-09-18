const { HttpError } = require('../../helpers');
const { Client } = require('../../models/clients/clients');

const fetchOneClient = async (req, res) => {
  const { id } = req.params;
  const client = await Client.findById(id);

  if (!client) {
    throw (HttpError(404), 'Client not fount');
  }

  return res.status(200).json({
    status: 'OK',
    code: 200,
    client,
  });
};

module.exports = fetchOneClient;
