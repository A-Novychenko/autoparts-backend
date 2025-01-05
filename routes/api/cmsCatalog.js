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
router.get('/', getCmsAllCategories);

//получение товаров по id категории в админке
router.get('/products', getCmsProductsByCategory);

//изменение процента наценки в категории, используется в админке в категориях
router.put('/margin', updCmsCategoryMargin);

//поиск товаров в админке
router.post(
  '/search-products',
  authenticate,
  validateBody(schemasProducts.getCmsProduct),
  getCmsProductsByArticle,
);

//включение/отключение товара в баннер
router.put('/banner', updCmsProductBanner);

//включение/отключение товара в распродажу/акции
router.put('/sale', updCmsProductSale);

//включение/отключение товара в распродажу/акции
router.put('/price-promo', updCmsProductPricePromo);

module.exports = router;
