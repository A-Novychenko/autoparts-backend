const { ctrlWrap } = require('../../decorators');
const getMainCategory = require('./getMainCategory');
const getAllCategories = require('./getAllCategories');
const getAllCategoriesWithMain = require('./getAllCategoriesWithMain');
const getCategory = require('./getCategory');
const getProducts = require('./getProducts');
const getProductsByTecDocArticle = require('./getProductsByTecDocArticle');
const getCmsProductsByArticle = require('./getCmsProductsByArticle');
const addBanner = require('./addBanner');
const getAllBanner = require('./getAllBanner');

module.exports = {
  getMainCategory: ctrlWrap(getMainCategory),
  getAllCategories: ctrlWrap(getAllCategories),
  getAllCategoriesWithMain: ctrlWrap(getAllCategoriesWithMain),
  getCategory: ctrlWrap(getCategory),
  getProducts: ctrlWrap(getProducts),
  getProductsByTecDocArticle: ctrlWrap(getProductsByTecDocArticle),
  getCmsProductsByArticle: ctrlWrap(getCmsProductsByArticle),
  addBanner: ctrlWrap(addBanner),
  getAllBanner: ctrlWrap(getAllBanner),
};
