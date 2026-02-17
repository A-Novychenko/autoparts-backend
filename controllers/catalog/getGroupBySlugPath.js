const { Group } = require('../../models/asg/groups');

const { HttpError } = require('../../helpers');

const getGroupBySlugPath = async (req, res) => {
  const { slug } = req.params;

  // 1. Ищем саму категорию
  const group = await Group.findOne({ slug }).lean();

  if (!group) {
    throw HttpError(404, 'Group not found');
  }

  // 2. Проверяем, есть ли у неё вложенные категории (дети)
  // Это очень быстрый запрос, так как мы ищем только _id
  const hasChildren = await Group.exists({ parent: group._id });

  res.json({
    status: 'OK',
    code: 200,
    group,
    isLeaf: !hasChildren, // Флаг: true - если это конечная группа (нужны товары), false - если есть подгруппы
  });
};

module.exports = getGroupBySlugPath;
