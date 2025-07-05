const { Callback } = require('../../models/orders/callback');

const updateCallback = async (req, res) => {
  const { id } = req.params;

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
