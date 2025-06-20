const express = require('express');

const {
  getMainCategories,
  getCategoriesByParentId,
  getCategory,
  getProducts,
  getProductsForCartByIds,
  searchProducts,
  getProductsBanner,
  getOneProduct,
  getSitemap,
  getTotalProducts,
} = require('../../controllers/catalog');
const { isValidId, authenticate, isAdmin } = require('../../middlewares');

const router = express.Router();

//категории при рендере главной страницы сайта. Главные категории с parent_id=0
router.get('/main-categories', getMainCategories);

//категории на странице [category]. Категорий которые принадлежат по parent_id
router.get('/categories', getCategoriesByParentId); //byParentId

//получения данных на странице открытой категории [product] о категории (имени) по id
router.get('/category/:id', getCategory);

//получение товаров на странице [category]/[page] ? id & page = 1 & limit = 20 & favorite?
//id - это id категории к которой пренадлежат товары
router.get('/products', getProducts);

//получение/обновление товаров в корзине /cart ? ids
// ids - массив id товаров в корзине
router.get('/products-cart-list', getProductsForCartByIds);

//поиск товаров на сайте
router.post('/search-products', searchProducts);

//получение товаров для баннера
router.get('/banner', getProductsBanner);

//получение товаров для баннера
router.get('/single-product/:id', isValidId, getOneProduct);

//получение sitemap (test)
router.post('/sitemap', authenticate, isAdmin, getSitemap);

//получение sitemap (test)
router.get('/products-total', getTotalProducts);

module.exports = router;
