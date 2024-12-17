const { ctrlWrap } = require('../../decorators');

const getCmsAllCategories = require('./getCmsAllCategories');
const getCmsProductsByCategory = require('./getCmsProductsByCategory');
const updCategoryMargin = require('./updCategoryMargin');

module.exports = {
  getCmsAllCategories: ctrlWrap(getCmsAllCategories),
  getCmsProductsByCategory: ctrlWrap(getCmsProductsByCategory),
  updCategoryMargin: ctrlWrap(updCategoryMargin),
};
