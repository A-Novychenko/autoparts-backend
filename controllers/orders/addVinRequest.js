const { VinRequest } = require('../../models/orders/vin-request');

const addVinRequest = async (req, res) => {
  const result = await VinRequest.create({ ...req.body });

  res.status(201).json({
    status: 'created',
    code: 201,
    data: result,
  });
};

module.exports = addVinRequest;
