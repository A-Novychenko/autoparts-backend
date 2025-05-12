const { VinRequest } = require('../../models/orders/vin-request');

const updateVinRequests = async (req, res) => {
  const { id } = req.params;

  await VinRequest.findByIdAndUpdate(id, { ...req.body });

  res.status(200).json({
    status: 'success',
    code: 200,
  });
};
module.exports = updateVinRequests;
