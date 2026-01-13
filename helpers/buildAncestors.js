const HttpError = require('./HttpError');

// Вспомогательная функция для построения массива предков
const buildAncestors = async (parentId, GroupModel) => {
  if (!parentId) return [];
  const parent = await GroupModel.findById(parentId);
  if (!parent) throw HttpError(400, 'Родительская категория не найдена');

  // Берем предков родителя и добавляем самого родителя в конец
  return [
    ...parent.ancestors,
    {
      _id: parent._id,
      name: parent.name,
      slug: parent.slug,
    },
  ];
};

module.exports = buildAncestors;
