const express = require('express');
const { authenticate } = require('../../middlewares');
const {
  loginASG,
  getCategoriesASG,
  getAllProductsASG,
  updDB,
} = require('../../controllers/asg');

const router = express.Router();

// router.get('/login', authenticate, loginASG);
router.get('/login', loginASG);

// router.get('/login', authenticate, getCategoriesASG);
router.get('/categories', getCategoriesASG);

// router.get('/login', authenticate, getCategoriesASG);
router.get('/prices', getAllProductsASG);

router.post('/upd-db', updDB);

module.exports = router;
