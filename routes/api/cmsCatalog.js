const express = require('express');

const {
  getCmsAllCategories,
  getCmsProductsByCategory,
  updCmsCategoryMargin,
  getCmsProductsByArticle,
  updCmsProductBanner,
  updCmsProductSale,
  updCmsProductPricePromo,
  addCmsGroup,
  getCmsAllGroups,
  getCmsProductsByGroup,
  updateCmsGroup,
  deleteCmsGroup,
  updateCmsGroupImg,
  updCmsProductGroup,
  deleteCmsGroupImg,
} = require('../../controllers/cmsCatalog');

const { schemasProducts } = require('../../models/asg/products');

const {
  authenticate,
  isAdmin,
  isValidId,
  uploadCloud,
} = require('../../middlewares');

const { validateBody } = require('../../decorators');

const { schemas: schemasGroup } = require('../../models/asg/groups');

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

/////////////////
//роуты для групп

//добавить/создать группу товара
router.post(
  '/groups',
  authenticate,
  isAdmin,
  validateBody(schemasGroup.addPGroupSchema),
  addCmsGroup,
);
router.get('/groups', authenticate, getCmsAllGroups);
router.get('/product-by-group', authenticate, getCmsProductsByGroup);
router.put('/groups/:id', authenticate, isAdmin, updateCmsGroup);
router.delete('/groups/:id', authenticate, isAdmin, isValidId, deleteCmsGroup);
router.put(
  '/group-img',
  authenticate,
  isAdmin,
  uploadCloud.single('img'),
  updateCmsGroupImg,
);
router.put(
  '/change-group/:id',
  authenticate,
  isAdmin,
  isValidId,
  validateBody(schemasProducts.updProductGroupSchema),
  updCmsProductGroup,
);
router.delete(
  '/group-del-img/:id',
  authenticate,
  isAdmin,
  isValidId,
  deleteCmsGroupImg,
);

module.exports = router;
