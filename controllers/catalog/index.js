const { ctrlWrap } = require('../../decorators');

const getMainCategories = require('./getMainCategories');
const getCategoriesByParentId = require('./getCategoriesByParentId');
const getCategory = require('./getCategory');
const getProducts = require('./getProducts');
const getProductsForCartByIds = require('./getProductsForCartByIds');
const getProductsByTecDocArticle = require('./getProductsByTecDocArticle');
const getProductsBanner = require('./getProductsBanner');
const getOneProduct = require('./getOneProduct');

module.exports = {
  getMainCategories: ctrlWrap(getMainCategories),
  getCategoriesByParentId: ctrlWrap(getCategoriesByParentId),
  getCategory: ctrlWrap(getCategory),
  getProducts: ctrlWrap(getProducts),
  getProductsForCartByIds: ctrlWrap(getProductsForCartByIds),
  getProductsByTecDocArticle: ctrlWrap(getProductsByTecDocArticle),
  getProductsBanner: ctrlWrap(getProductsBanner),
  getOneProduct: ctrlWrap(getOneProduct),
};
