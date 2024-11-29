const { ctrlWrap } = require('../../decorators');

const DBUpdASGAllCategories = require('./DBUpdASGAllCategories');
const DBUpdASGAllProducts = require('./DBUpdASGAllProducts');
const DBUpdASGAllImages = require('./DBUpdASGAllImages');

module.exports = {
  DBUpdASGAllCategories: ctrlWrap(DBUpdASGAllCategories),
  DBUpdASGAllProducts: ctrlWrap(DBUpdASGAllProducts),
  DBUpdASGAllImages: ctrlWrap(DBUpdASGAllImages),
};
