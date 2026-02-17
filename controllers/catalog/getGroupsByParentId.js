const { Group } = require('../../models/asg/groups');

const getGroupsByParentId = async (req, res) => {
  const { parent } = req.query;
  // Если parent передан, ищем по нему, иначе ищем корневые (parent: null)
  const filter = parent ? { parent } : { parent: null };

  // Сортировка важна для UX
  const groups = await Group.find(filter).sort({ name: 1 }).lean();

  res.json({
    status: 'OK',
    code: 200,
    groups,
  });
};

module.exports = getGroupsByParentId;
