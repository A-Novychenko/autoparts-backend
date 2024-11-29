const express = require('express');

const {
  getMainCategory,
  getAllCategories,
  getCategory,
  getProducts,
  getProductsByTecDocArticle,
  addBanner,
} = require('../../controllers/catalog');

const { schemas } = require('../../models/asg/categories');
const { schemasBanner } = require('../../models/banner');

const { validateBody } = require('../../decorators');
const { authenticate } = require('../../middlewares');

const router = express.Router();

router.get('/', getMainCategory);

router.get('/category', getAllCategories);

router.post('/category', validateBody(schemas.getCategory), getCategory);

router.get('/products', getProducts);

router.post('/search-products', getProductsByTecDocArticle);

router.post(
  '/banner',
  authenticate,
  validateBody(schemasBanner.addBanner),
  addBanner,
);

module.exports = router;
