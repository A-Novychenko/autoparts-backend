const { serviceASG } = require('../../helpers');
const ASGCategory = require('../../models/asg/categories');

const getCategoriesASG = async (req, res) => {
  // const { data } = await serviceASG.post('/categories');

  //получить все категории ASG
  //http:localhost:3005/api/asg/categories
  // const categories = await ASGCategory.create(data.data);

  res.json({ status: 'OK', code: 200, categories: data.data });
};

module.exports = getCategoriesASG;
