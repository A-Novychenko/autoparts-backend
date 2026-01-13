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
  generateSitemapCtrl,
  getTotalProducts,
  getBrandsCategories,
  getTopProducts,
  addTopProducts,
  addGroup,
  getAllGroups,
  updateGroup,
  deleteGroup,
  updateGroupImg,
  deleteGroupImg,
  updProductGroup,
  getProductsByGroup,
} = require('../../controllers/catalog');
const {
  isValidId,
  authenticate,
  isAdmin,
  uploadCloud,
} = require('../../middlewares');
const { validateBody } = require('../../decorators');
const { schemas: schemasGroup } = require('../../models/asg/groups');
const { schemasProducts } = require('../../models/asg/products');

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

//получение товаров для топ-товаров
router.get('/top-products', getTopProducts);
//добавление товаров для топ-товаров
router.post('/top-products', authenticate, isAdmin, addTopProducts);

//получение товаров для страницы продукта
router.get('/single-product/:id', isValidId, getOneProduct);

//получение sitemap (test)
router.post('/sitemap', authenticate, isAdmin, generateSitemapCtrl);

//общее количество товаров
router.get('/products-total', getTotalProducts);

//бренды-категории
router.get('/brands-categories', getBrandsCategories);

//добавить/создать группу товара
router.post(
  '/groups',
  authenticate,
  isAdmin,
  validateBody(schemasGroup.addPGroupSchema),
  addGroup,
);
router.get('/groups', authenticate, getAllGroups);
router.get('/product-by-group', authenticate, getProductsByGroup);
router.put('/groups/:id', authenticate, isAdmin, updateGroup);
router.delete('/groups/:id', authenticate, isAdmin, isValidId, deleteGroup);
router.put(
  '/group-img',
  authenticate,
  isAdmin,
  uploadCloud.single('img'),
  updateGroupImg,
);
router.put(
  '/change-group/:id',
  authenticate,
  isAdmin,
  isValidId,
  validateBody(schemasProducts.updProductGroupSchema),
  updProductGroup,
);
router.delete(
  '/group-del-img/:id',
  authenticate,
  isAdmin,
  isValidId,
  deleteGroupImg,
);

module.exports = router;
