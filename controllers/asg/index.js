const { ctrlWrap } = require('../../decorators');
const loginASG = require('./loginASG');
const getCategoriesASG = require('./getCategoriesASG');
const getAllProductsASG = require('./getAllProductsASG');
const DBUpdASGAllProducts = require('./DBUpdASGAllProducts');
const DBUpdASGAllImages = require('./DBUpdASGAllImages');

module.exports = {
  loginASG: ctrlWrap(loginASG),
  getCategoriesASG: ctrlWrap(getCategoriesASG),
  getAllProductsASG: ctrlWrap(getAllProductsASG),
  DBUpdASGAllProducts: ctrlWrap(DBUpdASGAllProducts),
  DBUpdASGAllImages: ctrlWrap(DBUpdASGAllImages),
};
