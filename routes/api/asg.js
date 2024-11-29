const express = require('express');

const { authenticate, isAdmin } = require('../../middlewares');

const {
  DBUpdASGAllCategories,
  DBUpdASGAllProducts,
  DBUpdASGAllImages,
} = require('../../controllers/asg');

const router = express.Router();

router.get('/categories', authenticate, isAdmin, DBUpdASGAllCategories);

router.post('/upd-db-products', authenticate, isAdmin, DBUpdASGAllProducts);

router.post('/upd-db-images', authenticate, isAdmin, DBUpdASGAllImages);

module.exports = router;
