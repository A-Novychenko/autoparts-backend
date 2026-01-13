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
const addGroup = require('./addGroup');
const getAllGroups = require('./getAllGroups');
const deleteGroup = require('./deleteGroup');
const updateGroup = require('./updateGroup');
const updateGroupImg = require('./updateGroupImg');
const deleteGroupImg = require('./deleteGroupImg');
const updProductGroup = require('./updProductGroup');
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
  addGroup: ctrlWrap(addGroup),
  getAllGroups: ctrlWrap(getAllGroups),
  deleteGroup: ctrlWrap(deleteGroup),
  updateGroup: ctrlWrap(updateGroup),
  updateGroupImg: ctrlWrap(updateGroupImg),
  deleteGroupImg: ctrlWrap(deleteGroupImg),
  updProductGroup: ctrlWrap(updProductGroup),
  getProductsByGroup: ctrlWrap(getProductsByGroup),
};
