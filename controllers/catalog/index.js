const { ctrlWrap } = require('../../decorators');

const getMainCategories = require('./getMainCategories');
const getCategoriesByParentId = require('./getCategoriesByParentId');
const getCategory = require('./getCategory');
const getProducts = require('./getProducts');
const getProductsByTecDocArticle = require('./getProductsByTecDocArticle');

module.exports = {
  getMainCategories: ctrlWrap(getMainCategories),
  getCategoriesByParentId: ctrlWrap(getCategoriesByParentId),
  getCategory: ctrlWrap(getCategory),
  getProducts: ctrlWrap(getProducts),
  getProductsByTecDocArticle: ctrlWrap(getProductsByTecDocArticle),
};
