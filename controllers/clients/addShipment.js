const { HttpError } = require('../../helpers');
const { Client } = require('../../models/clients/clients');
const { Shipment } = require('../../models/clients/shipments');

const addShipment = async (req, res) => {
  const { id } = req.params;

  const client = await Client.findById(id);

  if (!client) {
    throw HttpError(404, 'Client not found');
  }

  const newShipment = await Shipment.create(req.body);

  console.log('newShipment', newShipment);

  res.status(201).json({
    code: 201,
    status: 'created',
    newShipment,
  });
};

module.exports = addShipment;
