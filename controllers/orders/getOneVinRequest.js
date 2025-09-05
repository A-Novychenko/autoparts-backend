const { VinRequest } = require('../../models/orders/vin-request');

const getOneVinRequest = async (req, res) => {
  const { id } = req.params;

  const result = await VinRequest.findById(id);

  res.status(200).json({
    status: 'success',
    code: 200,
    data: result,
  });
};
module.exports = getOneVinRequest;
