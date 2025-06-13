const { ASGCategory } = require('../../models/asg/categories');

const { HttpError } = require('../../helpers');

const getCategory = async (req, res) => {
  const { id } = req.params;

  const idNumber = Number(id);

  if (isNaN(idNumber)) {
    throw HttpError(400);
  }

  const result = await ASGCategory.findOne({ id: idNumber });

  if (!result) throw HttpError(404);

  const resultParentCat = await ASGCategory.findOne({ id: result.parent_id });

  const category = {
    id: result.id,
    parentId: result.parent_id,
    name: result.name,
    parentName: resultParentCat?.name,
  };

  res.json({
    status: 'OK',
    code: 200,
    category,
  });
};

module.exports = getCategory;
