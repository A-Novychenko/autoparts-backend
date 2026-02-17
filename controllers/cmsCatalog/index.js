const { ctrlWrap } = require('../../decorators');

const getCmsAllCategories = require('./getCmsAllCategories');
const getCmsProductsByCategory = require('./getCmsProductsByCategory');
const updCmsCategoryMargin = require('./updCmsCategoryMargin');
const getCmsProductsByArticle = require('./getCmsProductsByArticle');
const updCmsProductBanner = require('./updCmsProductBanner');
const updCmsProductSale = require('./updCmsProductSale');
const updCmsProductPricePromo = require('./updCmsProductPricePromo');

const addCmsGroup = require('./addCmsGroup');
const getCmsAllGroups = require('./getCmsAllGroups');
const deleteCmsGroup = require('./deleteCmsGroup');
const updateCmsGroup = require('./updateCmsGroup');
const updateCmsGroupImg = require('./updateCmsGroupImg');
const deleteCmsGroupImg = require('./deleteCmsGroupImg');
const updCmsProductGroup = require('./updCmsProductGroup');
const getCmsProductsByGroup = require('./getCmsProductsByGroup');

module.exports = {
  getCmsAllCategories: ctrlWrap(getCmsAllCategories),
  getCmsProductsByCategory: ctrlWrap(getCmsProductsByCategory),
  updCmsCategoryMargin: ctrlWrap(updCmsCategoryMargin),
  getCmsProductsByArticle: ctrlWrap(getCmsProductsByArticle),
  updCmsProductBanner: ctrlWrap(updCmsProductBanner),
  updCmsProductSale: ctrlWrap(updCmsProductSale),
  updCmsProductPricePromo: ctrlWrap(updCmsProductPricePromo),

  addCmsGroup: ctrlWrap(addCmsGroup),
  getCmsAllGroups: ctrlWrap(getCmsAllGroups),
  deleteCmsGroup: ctrlWrap(deleteCmsGroup),
  updateCmsGroup: ctrlWrap(updateCmsGroup),
  updateCmsGroupImg: ctrlWrap(updateCmsGroupImg),
  deleteCmsGroupImg: ctrlWrap(deleteCmsGroupImg),
  updCmsProductGroup: ctrlWrap(updCmsProductGroup),
  getCmsProductsByGroup: ctrlWrap(getCmsProductsByGroup),
};
