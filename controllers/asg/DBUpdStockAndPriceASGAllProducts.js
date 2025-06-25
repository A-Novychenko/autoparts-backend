const pLimit = require('p-limit');
const { ASGProduct } = require('../../models/asg/products');
const { serviceASG } = require('../../helpers');
const { ASG_LOGIN, ASG_PASSWORD } = process.env;

const MAX_CONCURRENT_REQUESTS = 25;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

// 🔁 Универсальный retry
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

// 📦 Получение страницы с авторизацией
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

// 💾 Обновление ТОЛЬКО цены и остатков
const updateStockAndPriceInDB = async items => {
  if (!Array.isArray(items) || items.length === 0) return;

  const ops = items.map(item => ({
    updateOne: {
      filter: { id: item.id },
      update: {
        $set: {
          price_currency_980: item.price_currency_980,
          count_warehouse_3: item.count_warehouse_3,
          count_warehouse_4: item.count_warehouse_4,
        },
      },
    },
  }));

  await ASGProduct.bulkWrite(ops, { ordered: false });
};

// 🚀 Главный контроллер
const DBUpdStockAndPriceASGAllProducts = async (req, res) => {
  console.log('📦 Старт обновления цен и остатков...');
  const limit = pLimit(MAX_CONCURRENT_REQUESTS);
  const failedPages = [];
  let updated = 0;

  try {
    const first = await fetchBatch(1);
    const perPage = first.per_page || first.data.items.length;
    const totalItems = first.total || first.data.items.length;
    const totalPages = Math.ceil(totalItems / perPage);

    console.log(
      `🔢 Всего страниц: ${totalPages}, товаров: ${totalItems}, на стр.: ${perPage}`,
    );

    const tasks = [];

    for (let page = 1; page <= totalPages; page++) {
      tasks.push(
        limit(async () => {
          try {
            const data = page === 1 ? first : await fetchBatch(page);
            const items = data?.data?.items || [];

            if (items.length) {
              await updateStockAndPriceInDB(items);
              updated += items.length;
              console.log(`✅ Стр. ${page}: обновлено ${items.length}`);
            } else {
              console.warn(`⚠️ Пустая страница ${page}`);
            }
          } catch (err) {
            const status = err?.response?.status;
            console.error(
              `❌ Ошибка на стр. ${page}: ${status} - ${err.message}`,
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
        message: 'Обновление завершено частично',
        updatedCount: updated,
        failedPages,
      });
    } else {
      console.log('✅ Обновление цен и остатков завершено.');
      res.json({
        status: 'success',
        code: 200,
        message: 'Все товары обновлены',
        updatedCount: updated,
      });
    }
  } catch (e) {
    console.error('🔥 Критическая ошибка:', e.message);
    res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Не удалось завершить обновление',
    });
  }
};

module.exports = DBUpdStockAndPriceASGAllProducts;
