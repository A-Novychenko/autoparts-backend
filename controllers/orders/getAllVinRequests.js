const { VinRequest } = require('../../models/orders/vin-request');

const getAllVinRequests = async (req, res) => {
  // const result = await VinRequest.find({}).sort({ createdAt: -1 });
  const result = await VinRequest.find(
    {},
    '_id number status name phone vinCode message createdAt',
  ).sort({ number: -1 });

  res.status(200).json({
    status: 'success',
    code: 200,

    vinRequestItems: result,
  });
};

module.exports = getAllVinRequests;
