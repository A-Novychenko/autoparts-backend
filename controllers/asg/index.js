const { ctrlWrap } = require('../../decorators');
const loginASG = require('./loginASG');
const getCategoriesASG = require('./getCategoriesASG');
const getAllProductsASG = require('./getAllProductsASG');

module.exports = {
  loginASG: ctrlWrap(loginASG),
  getCategoriesASG: ctrlWrap(getCategoriesASG),
  getAllProductsASG: ctrlWrap(getAllProductsASG),
};
