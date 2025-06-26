const express = require('express');

const {
  getCmsAllCategories,
  getCmsProductsByCategory,
  updCmsCategoryMargin,
  getCmsProductsByArticle,
  updCmsProductBanner,
  updCmsProductSale,
  updCmsProductPricePromo,
} = require('../../controllers/cmsCatalog');

const { schemasProducts } = require('../../models/asg/products');

const { authenticate } = require('../../middlewares');

const { validateBody } = require('../../decorators');

const router = express.Router();

//получение всех категорий с вложенными (рекурсивно) админка
router.get('/', authenticate, getCmsAllCategories);

//получение товаров по id категории в админке
router.get('/products', authenticate, getCmsProductsByCategory);

//изменение процента наценки в категории, используется в админке в категориях
router.put('/margin', authenticate, updCmsCategoryMargin);

//поиск товаров в админке
router.post(
  '/search-products',
  authenticate,
  validateBody(schemasProducts.getCmsProduct),
  getCmsProductsByArticle,
);

//включение/отключение товара в баннер
router.put('/banner', authenticate, updCmsProductBanner);

//включение/отключение товара в распродажу/акции
router.put('/sale', authenticate, updCmsProductSale);

//включение/отключение товара в распродажу/акции
router.put('/price-promo', authenticate, updCmsProductPricePromo);

module.exports = router;
