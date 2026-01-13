const { buildAncestors } = require('../../helpers'); // Ваш хелпер ошибок
const { Group } = require('../../models/asg/groups');

const addGroup = async (req, res) => {
  const { name, slug, parent, margin, img, isVisible } = req.body;

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
  });

  res.json({
    status: 'OK',
    code: 201,
    group: newGroup,
  });
};

module.exports = addGroup;
