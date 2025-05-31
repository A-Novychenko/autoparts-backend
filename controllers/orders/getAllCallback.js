const { Callback } = require('../../models/orders/callback');

const getAllCallback = async (req, res) => {
  const result = await Callback.find({}).sort({ number: -1 });

  res.status(200).json({
    status: 'success',
    code: 200,

    data: result,
  });
};

module.exports = getAllCallback;
