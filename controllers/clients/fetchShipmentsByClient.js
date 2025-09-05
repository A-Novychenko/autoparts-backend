const { Shipment } = require('../../models/clients/shipments');

const fetchShipmentsByClient = async (req, res) => {
  const { id } = req.params;

  const shipments = await Shipment.find({ client: id });

  res.status(200).json({
    status: 'success',
    code: 200,
    shipments,
  });
};

module.exports = fetchShipmentsByClient;
