const { Callback } = require('../../models/orders/callback');

const updateCallback = async (req, res) => {
  const { id } = req.params;

  console.log('req.body', req.body);

  const result = await Callback.findByIdAndUpdate(
    id,
    { ...req.body },
    { new: true },
  );

  res.status(200).json({
    status: 'success',
    code: 200,
    data: result,
  });
};

module.exports = updateCallback;
