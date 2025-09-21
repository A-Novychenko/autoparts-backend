const { Order } = require('../../models/orders/order');

const { HttpError } = require('../../helpers');

const addDeclarationNumber = async (req, res) => {
  const { user } = req;
  const { id } = req.params;
  const { declarationNumber } = req.body;

  const order = await Order.findById(id);

  if (!order) {
    throw HttpError(404);
  }

  if (order.declarationNumber.includes(declarationNumber)) {
    throw HttpError(409, 'Такой номер ТТН уже существует');
  }

  const updDeclarationNumber = [...order.declarationNumber, declarationNumber];

  const updOrder = await Order.findByIdAndUpdate(
    id,
    {
      declarationNumber: updDeclarationNumber,
      updatedBy: user.name,
    },
    { new: true },
  );

  res.status(201).json({
    status: 'created',
    code: 201,
    message: 'success',
    data: { updDeclarationNumbers: updOrder.declarationNumber },
  });
};

module.exports = addDeclarationNumber;
