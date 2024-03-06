const { ctrlWrap } = require('../../decorators');
const getMainCategory = require('./getMainCategory');
const getCategory = require('./getCategory');
const getProducts = require('./getProducts');

module.exports = {
  getMainCategory: ctrlWrap(getMainCategory),
  getCategory: ctrlWrap(getCategory),
  getProducts: ctrlWrap(getProducts),
};
