const express = require('express');

const {
  getMainCategory,
  getCategory,
  getProducts,
} = require('../../controllers/catalog');
const { validateBody } = require('../../decorators');

const router = express.Router();

router.get('/', getMainCategory);
router.get('/category', getCategory);
router.get('/products', getProducts);

module.exports = router;
