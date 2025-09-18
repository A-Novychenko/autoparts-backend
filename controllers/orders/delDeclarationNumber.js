const { Order } = require('../../models/orders/order');

const { HttpError } = require('../../helpers');

const delDeclarationNumber = async (req, res) => {
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
    },
    { new: true },
  );

  res.status(204).end();
};

module.exports = delDeclarationNumber;
