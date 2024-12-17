const { ASGCategory } = require('../../models/asg/categories');

const { HttpError } = require('../../helpers');

const getCategory = async (req, res) => {
  const { id } = req.params;

  const idNumber = Number(id);

  if (isNaN(idNumber)) {
    throw HttpError(400);
  }

  const categories = await ASGCategory.findOne({ id: idNumber });

  res.json({
    status: 'OK',
    code: 200,
    categories,
  });
};

module.exports = getCategory;
