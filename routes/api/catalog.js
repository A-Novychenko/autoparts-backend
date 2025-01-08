const express = require('express');

const {
  getMainCategories,
  getCategoriesByParentId,
  getCategory,
  getProducts,
  getProductsForCartByIds,
  getProductsByTecDocArticle,
  getProductsBanner,
} = require('../../controllers/catalog');

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
router.post('/search-products', getProductsByTecDocArticle);

//получение товаров для баннера
router.get('/banner', getProductsBanner);

module.exports = router;
