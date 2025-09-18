const { HttpError } = require('../../helpers');
const { Shipment } = require('../../models/clients/shipments');

const deleteShipment = async (req, res) => {
  const { id } = req.params;

  const result = await Shipment.findByIdAndDelete(id);

  if (!result) {
    throw HttpError(404);
  }

  res.status(204).end();
};

module.exports = deleteShipment;
