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
const getBrandsCategories = require('./getBrandsCategories');
const getTopProducts = require('./getTopProducts');
const addTopProducts = require('./addTopProducts');

const getAllGroups = require('./getAllGroups');
const getRootGroups = require('./getRootGroups');
const getGroupBySlugPath = require('./getGroupBySlugPath');
const getGroupsByParentId = require('./getGroupsByParentId');
const getProductsByGroup = require('./getProductsByGroup');

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
  getBrandsCategories: ctrlWrap(getBrandsCategories),
  getTopProducts: ctrlWrap(getTopProducts),
  addTopProducts: ctrlWrap(addTopProducts),

  getAllGroups: ctrlWrap(getAllGroups),
  getRootGroups: ctrlWrap(getRootGroups),
  getGroupBySlugPath: ctrlWrap(getGroupBySlugPath),
  getGroupsByParentId: ctrlWrap(getGroupsByParentId),
  getProductsByGroup: ctrlWrap(getProductsByGroup),
};
