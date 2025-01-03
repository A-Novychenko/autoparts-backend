const { ctrlWrap } = require('../../decorators');

const getCmsAllCategories = require('./getCmsAllCategories');
const getCmsProductsByCategory = require('./getCmsProductsByCategory');
const updCmsCategoryMargin = require('./updCmsCategoryMargin');
const getCmsProductsByArticle = require('./getCmsProductsByArticle');
const updCmsProductBanner = require('./updCmsProductBanner');

module.exports = {
  getCmsAllCategories: ctrlWrap(getCmsAllCategories),
  getCmsProductsByCategory: ctrlWrap(getCmsProductsByCategory),
  updCmsCategoryMargin: ctrlWrap(updCmsCategoryMargin),
  getCmsProductsByArticle: ctrlWrap(getCmsProductsByArticle),
  updCmsProductBanner: ctrlWrap(updCmsProductBanner),
};
