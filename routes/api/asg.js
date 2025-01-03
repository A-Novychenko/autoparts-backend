const express = require('express');

const { authenticate, isAdmin } = require('../../middlewares');

const {
  DBUpdASGAllCategories,
  DBUpdASGAllProducts,
  DBUpdASGAllImages,
} = require('../../controllers/asg');

const { ASGProduct } = require('../../models/asg/products');

const router = express.Router();

const addDefaultFields = async (req, res) => {
  try {
    await ASGProduct.updateMany(
      {},
      {
        $set: {
          price_promo: null,
        },
      },
    );
    console.log('Fields added successfully to all documents');
  } catch (error) {
    console.error('Error adding default fields:', error.message);
  }

  res.end();
};

router.get('/categories', authenticate, isAdmin, DBUpdASGAllCategories);

router.post('/upd-db-categories', authenticate, isAdmin, DBUpdASGAllCategories);

router.post('/upd-db-products', authenticate, isAdmin, DBUpdASGAllProducts);

router.post('/upd-db-images', authenticate, isAdmin, DBUpdASGAllImages);

router.get('/upd-fields', addDefaultFields);

module.exports = router;
