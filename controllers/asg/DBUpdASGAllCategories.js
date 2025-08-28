const { ASGCategory } = require('../../models/asg/categories');
const { ASGProduct } = require('../../models/asg/products');
const { serviceASG } = require('../../helpers');

const ASG_LOGIN = process.env.ASG_LOGIN;
const ASG_PASSWORD = process.env.ASG_PASSWORD;

const wait = ms => new Promise(r => setTimeout(r, ms));

const fetchCategoriesWithRetry = async (retries = 3, delay = 3000) => {
  try {
    const { data } = await serviceASG.post('/categories');
    return data.data;
  } catch (e) {
    const status = e.response?.status;
    if (status === 401 && retries > 0) {
      console.log('Refreshing token...');
      const credentials = { login: ASG_LOGIN, password: ASG_PASSWORD };
      const resASG = await serviceASG.post('/auth/login', credentials);
      serviceASG.defaults.headers.common.Authorization = `Bearer ${resASG.data.access_token}`;
      return fetchCategoriesWithRetry(retries - 1, delay);
    }
    if (status === 429 && retries > 0) {
      const retryAfter = e.response?.headers['retry-after'];
      const waitTime = retryAfter ? Number(retryAfter) * 1000 : delay;
      console.warn(`Rate limited. Waiting ${waitTime}ms before retry...`);
      await wait(waitTime);
      return fetchCategoriesWithRetry(retries - 1, delay * 2);
    }
    console.error('Error fetching categories:', e.message);
    throw new Error('Failed to fetch categories');
  }
};

const DBUpdASGAllCategories = async (req, res) => {
  // 1. Получение категорий от API
  const rawCategories = await fetchCategoriesWithRetry();

  // 2. Нормализация (приводим id и parent_id к числу, фильтруем без id)
  const newCategories = rawCategories
    .map(c => {
      if (!c.id) return null;
      return {
        ...c,
        id: Number(c.id),
        parent_id: Number(c.parent_id),
      };
    })
    .filter(Boolean);

  // 3. Получаем текущие категории из БД
  const existingCategories = await ASGCategory.find({}, { id: 1 });
  const existingCategoryIds = existingCategories.map(c => c.id);
  const newCategoryIds = newCategories.map(c => c.id);

  // 4. Удаление устаревших категорий
  const categoriesToDelete = existingCategoryIds.filter(
    id => !newCategoryIds.includes(id),
  );
  if (categoriesToDelete.length > 0) {
    await ASGCategory.deleteMany({ id: { $in: categoriesToDelete } });
  }

  // 5. Получаем все уникальные category_id из товаров
  const allProductCategoryIds = await ASGProduct.distinct('category_id');
  const productCategoryIdSet = new Set(allProductCategoryIds);

  // 6. Формируем bulk-операции с флагами hasChildren и hasProducts
  const bulkOperations = newCategories.map(category => {
    const hasChildren = newCategories.some(c => c.parent_id === category.id);
    const hasProducts = productCategoryIdSet.has(category.id);

    return {
      updateOne: {
        filter: { id: category.id },
        update: {
          $set: {
            ...category,
            hasChildren,
            hasProducts,
          },
        },
        upsert: true,
      },
    };
  });

  const CHUNK_SIZE = 1000;
  for (let i = 0; i < bulkOperations.length; i += CHUNK_SIZE) {
    const chunk = bulkOperations.slice(i, i + CHUNK_SIZE);
    await ASGCategory.bulkWrite(chunk);
  }

  // 8. Ответ клиенту
  res.json({
    status: 'OK',
    code: 200,
    message: 'Категорії оновлено успішно',
  });
};

module.exports = DBUpdASGAllCategories;
