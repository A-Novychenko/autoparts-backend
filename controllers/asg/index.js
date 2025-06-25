const { ctrlWrap } = require('../../decorators');

const DBUpdASGAllCategories = require('./DBUpdASGAllCategories');
const DBUpdASGAllProducts = require('./DBUpdASGAllProducts');
const DBUpdASGAllImages = require('./DBUpdASGAllImages');
const regenerateProductSearchIndex = require('./regenerateProductSearchIndex');
const DBUpdStockAndPriceASGAllProducts = require('./DBUpdStockAndPriceASGAllProducts');

module.exports = {
  DBUpdASGAllCategories: ctrlWrap(DBUpdASGAllCategories),
  DBUpdASGAllProducts: ctrlWrap(DBUpdASGAllProducts),
  DBUpdASGAllImages: ctrlWrap(DBUpdASGAllImages),
  regenerateProductSearchIndex: ctrlWrap(regenerateProductSearchIndex),
  DBUpdStockAndPriceASGAllProducts: ctrlWrap(DBUpdStockAndPriceASGAllProducts),
};
