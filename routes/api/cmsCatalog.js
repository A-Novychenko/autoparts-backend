const express = require('express');

const {
  getCmsAllCategories,
  getCmsProductsByCategory,
} = require('../../controllers/cmsCatalog');

// const { schemas } = require('../../models/asg/categories');
// const { schemasBanner } = require('../../models/banner');
// const { schemasProducts } = require('../../models/asg/products');

// const { validateBody } = require('../../decorators');
// const { authenticate } = require('../../middlewares');

const router = express.Router();

router.get('/', getCmsAllCategories);
router.get('/products', getCmsProductsByCategory);

// router.get('/category', getAllCategories); //byParentId

// router.get('/category-with-main', getAllCategoriesWithMain);

// router.post('/category', validateBody(schemas.getCategory), getCategory);

// router.get('/products', getProducts);

// router.post('/search-products', getProductsByTecDocArticle);

// router.post(
//   '/cms-search-products',
//   authenticate,
//   validateBody(schemasProducts.getCmsProduct),
//   getCmsProductsByArticle,
// );

// router.post(
//   '/banner',
//   authenticate,
//   validateBody(schemasBanner.addBanner),
//   addBanner,
// );

// router.get('/banner', getAllBanner);

module.exports = router;
