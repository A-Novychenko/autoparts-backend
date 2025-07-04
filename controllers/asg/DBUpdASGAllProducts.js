const pLimit = require('p-limit');
const { ASGProduct } = require('../../models/asg/products');
const { serviceASG } = require('../../helpers');
const { ASG_LOGIN, ASG_PASSWORD } = process.env;

const MAX_CONCURRENT_REQUESTS = 25;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

// 🔁 Повтор запроса с задержкой и отловом ошибок
const retryRequest = async (
  fn,
  retries = MAX_RETRIES,
  delay = RETRY_DELAY_MS,
) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (e) {
      const status = e?.response?.status;
      if (i < retries - 1 && [500, 502, 504, 429].includes(status)) {
        await new Promise(r => setTimeout(r, delay));
      } else {
        throw e;
      }
    }
  }
};

// 📦 Получение страницы с учетом авторизации и ошибок
const fetchBatch = async page => {
  return retryRequest(async () => {
    try {
      const res = await serviceASG.post(`/prices?page=${page}`);
      return res.data;
    } catch (e) {
      if (e?.response?.status === 401) {
        const auth = await serviceASG.post('/auth/login', {
          login: ASG_LOGIN,
          password: ASG_PASSWORD,
        });
        serviceASG.defaults.headers.common.Authorization = `Bearer ${auth.data.access_token}`;
        const retryRes = await serviceASG.post(`/prices?page=${page}`);
        return retryRes.data;
      } else {
        throw e;
      }
    }
  });
};

// 🧠 Подготовка и сохранение товаров в MongoDB
const updateDatabase = async items => {
  if (!Array.isArray(items) || items.length === 0) return;

  const bulkOps = items.map(item => {
    const searchIndex = `
      ${item.name || ''}
      ${item.description || ''}
      ${item.brand || ''}
      ${item.category || ''}
    `
      .toLowerCase()
      .replace(/[^a-zа-яё0-9]+/gi, ' ')
      .replace(/\b(\d+w)[\s\-]?(\d+)\b/g, '$1$2')
      .trim()
      .slice(0, 500);

    return {
      updateOne: {
        filter: { id: item.id },
        update: {
          $set: {
            ...item,
            search_index: searchIndex,
          },
        },
        upsert: true,
      },
    };
  });

  await ASGProduct.bulkWrite(bulkOps, { ordered: false });
};

// 🚀 Главный контроллер
const DBUpdASGAllProducts = async (req, res) => {
  console.log('🚀 Начато обновление базы товаров ASG...');
  const limit = pLimit(MAX_CONCURRENT_REQUESTS);
  const failedPages = [];
  const allIds = new Set();

  try {
    const first = await fetchBatch(1);
    const perPage = first.per_page || first.data.items.length;
    const totalItems = first.total || first.data.items.length;
    const totalPages = Math.ceil(totalItems / perPage);

    console.log(
      `📄 Всего страниц: ${totalPages}, товаров: ${totalItems}, на странице: ${perPage}`,
    );

    const tasks = [];

    for (let page = 1; page <= totalPages; page++) {
      tasks.push(
        limit(async () => {
          try {
            const data = page === 1 ? first : await fetchBatch(page);
            const items = data?.data?.items || [];
            if (items.length > 0) {
              await updateDatabase(items);
              items.forEach(i => allIds.add(i.id));
              console.log(`✅ Обработана страница ${page}`);
            } else {
              console.warn(`⚠️ Пустая страница ${page}`);
            }
          } catch (err) {
            const status = err?.response?.status;
            console.error(
              `❌ Ошибка на странице ${page}. Status: ${status}, Message: ${err.message}`,
            );
            failedPages.push(page);
          }
        }),
      );
    }

    await Promise.all(tasks);

    if (failedPages.length > 0) {
      console.warn(
        `⚠️ Завершено с ошибками. Пропущены страницы: ${failedPages.join(', ')}`,
      );
      res.status(207).json({
        status: 'partial',
        code: 207,
        message: 'База обновлена частично',
        failedPages,
      });
    } else {
      console.log('✅ Все страницы успешно обработаны.');
      res.json({
        status: 'success',
        code: 200,
        message: 'База успешно обновлена',
        updatedCount: allIds.size,
      });
    }
  } catch (e) {
    console.error('🔥 Критическая ошибка:', e.message);
    res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Обновление базы завершилось с ошибкой',
    });
  }
};

module.exports = DBUpdASGAllProducts;
