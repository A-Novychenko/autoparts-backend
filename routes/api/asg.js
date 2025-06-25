const express = require('express');

const { authenticate, isAdmin } = require('../../middlewares');

const {
  DBUpdASGAllCategories,
  DBUpdASGAllProducts,
  DBUpdASGAllImages,
  regenerateProductSearchIndex,
  DBUpdStockAndPriceASGAllProducts,
} = require('../../controllers/asg');

const router = express.Router();

router.get('/categories', authenticate, isAdmin, DBUpdASGAllCategories);

router.post('/upd-db-categories', authenticate, isAdmin, DBUpdASGAllCategories);

router.post('/upd-db-products', authenticate, isAdmin, DBUpdASGAllProducts);

router.post('/upd-db-images', authenticate, isAdmin, DBUpdASGAllImages);

router.post(
  '/upd-db-products-indexes',
  authenticate,
  isAdmin,
  regenerateProductSearchIndex,
);

router.post(
  '/upd-db-products-price-and-stock',
  authenticate,
  isAdmin,
  DBUpdStockAndPriceASGAllProducts,
);

module.exports = router;
