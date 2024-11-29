const { ctrlWrap } = require('../../decorators');
const getMainCategory = require('./getMainCategory');
const getAllCategories = require('./getAllCategories');
const getCategory = require('./getCategory');
const getProducts = require('./getProducts');
const getProductsByTecDocArticle = require('./getProductsByTecDocArticle');
const addBanner = require('./addBanner');

module.exports = {
  getMainCategory: ctrlWrap(getMainCategory),
  getAllCategories: ctrlWrap(getAllCategories),
  getCategory: ctrlWrap(getCategory),
  getProducts: ctrlWrap(getProducts),
  getProductsByTecDocArticle: ctrlWrap(getProductsByTecDocArticle),
  addBanner: ctrlWrap(addBanner),
};
