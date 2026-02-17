const { HttpError } = require('../../helpers');
const { Group } = require('../../models/asg/groups');
const { ASGProduct } = require('../../models/asg/products');

const deleteCmsGroup = async (req, res) => {
  const { id } = req.params;

  // Проверяем, есть ли подкатегории
  const children = await Group.findOne({ parent: id });
  if (children) {
    throw HttpError(
      400,
      'Нельзя удалить группу, содержащую подкатегории. Сначала переместите или удалите их.',
    );
  }

  // Тут также стоит проверить, есть ли товары в этой группе
  const products = await ASGProduct.findOne({ category: id });
  if (products) {
    throw HttpError(409, 'This group has products, please clear the group');
  }

  const result = await Group.findByIdAndDelete(id);
  if (!result) throw HttpError(404, 'Not found');

  res.json({ message: 'Group deleted' });
};

module.exports = deleteCmsGroup;
