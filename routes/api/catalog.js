const express = require('express');

const {
  getMainCategory,
  getCategory,
  getProducts,
  getProductsByTecDocArticle,
} = require('../../controllers/catalog');
const { validateBody } = require('../../decorators');

const router = express.Router();

router.get('/', getMainCategory);
router.get('/category', getCategory);
router.get('/products', getProducts);
router.post('/search-products', getProductsByTecDocArticle);

module.exports = router;
