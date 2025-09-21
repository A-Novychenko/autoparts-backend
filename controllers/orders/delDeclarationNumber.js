const { Order } = require('../../models/orders/order');

const { HttpError } = require('../../helpers');

const delDeclarationNumber = async (req, res) => {
  const { user } = req;
  const { id } = req.params;
  const { declarationNumber } = req.body;

  const order = await Order.findById(id);

  if (!order) {
    throw HttpError(404);
  }

  const idx = order.declarationNumber.indexOf(declarationNumber);

  if (idx < 0) {
    throw HttpError(404);
  }

  const updDeclarationNumber = order.declarationNumber.filter(
    num => num !== declarationNumber,
  );

  await Order.findByIdAndUpdate(
    id,
    {
      declarationNumber: updDeclarationNumber,
      updatedBy: user.name,
    },
    { new: true },
  );

  res.status(200).json({
    status: 'success',
    code: 200,
    updatedBy: user.name,
  });
};

module.exports = delDeclarationNumber;
