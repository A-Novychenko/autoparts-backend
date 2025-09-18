const { Shipment } = require('../../models/clients/shipments');

const updShipment = async (req, res) => {
  const { id } = req.params;

  const newShipment = await Shipment.findByIdAndUpdate(
    id,

    { ...req.body },
    { new: true },
  );

  res.status(201).json({
    code: 201,
    status: 'created',
    newShipment,
  });
};

module.exports = updShipment;
