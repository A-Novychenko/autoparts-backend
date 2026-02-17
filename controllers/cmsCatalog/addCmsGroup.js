const { buildAncestors } = require('../../helpers'); // Ваш хелпер ошибок
const { Group } = require('../../models/asg/groups');

const addCmsGroup = async (req, res) => {
  const { name, slug, parent, margin, img, isVisible, description } = req.body;

  // Если есть родитель, строим путь. Если нет - массив пустой.
  const ancestors = await buildAncestors(parent, Group);

  const newGroup = await Group.create({
    name,
    slug,
    parent: parent || null,
    ancestors,
    margin,
    img,
    isVisible,
    description: description || null,
  });

  res.json({
    status: 'OK',
    code: 201,
    group: newGroup,
  });
};

module.exports = addCmsGroup;
