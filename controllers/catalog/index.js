const { ctrlWrap } = require('../../decorators');
const getMainCategory = require('./getMainCategory');
const getCategory = require('./getCategory');
const getProducts = require('./getProducts');
const getProductsByTecDocArticle = require('./getProductsByTecDocArticle');

module.exports = {
  getMainCategory: ctrlWrap(getMainCategory),
  getCategory: ctrlWrap(getCategory),
  getProducts: ctrlWrap(getProducts),
  getProductsByTecDocArticle: ctrlWrap(getProductsByTecDocArticle),
};
