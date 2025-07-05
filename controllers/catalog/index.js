const { ctrlWrap } = require('../../decorators');

const getMainCategories = require('./getMainCategories');
const getCategoriesByParentId = require('./getCategoriesByParentId');
const getCategory = require('./getCategory');
const getProducts = require('./getProducts');
const getProductsForCartByIds = require('./getProductsForCartByIds');
const searchProducts = require('./searchProducts');
const getProductsBanner = require('./getProductsBanner');
const getOneProduct = require('./getOneProduct');
const generateSitemapCtrl = require('./generateSitemapCtrl');
const getTotalProducts = require('./getTotalProducts');

module.exports = {
  getMainCategories: ctrlWrap(getMainCategories),
  getCategoriesByParentId: ctrlWrap(getCategoriesByParentId),
  getCategory: ctrlWrap(getCategory),
  getProducts: ctrlWrap(getProducts),
  getProductsForCartByIds: ctrlWrap(getProductsForCartByIds),
  searchProducts: ctrlWrap(searchProducts),
  getProductsBanner: ctrlWrap(getProductsBanner),
  getOneProduct: ctrlWrap(getOneProduct),
  generateSitemapCtrl: ctrlWrap(generateSitemapCtrl),
  getTotalProducts: ctrlWrap(getTotalProducts),
};
