const pLimit = require('p-limit');
const { ASGProduct } = require('../../models/asg/products');
const { serviceASG } = require('../../helpers');
const { ASG_LOGIN, ASG_PASSWORD } = process.env;

const MAX_CONCURRENT_REQUESTS = 10;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

// Универсальный повторный запрос с задержкой
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
        console.warn(`Retrying after ${delay}ms... (${i + 1}/${retries})`);
        await new Promise(r => setTimeout(r, delay));
      } else {
        throw e;
      }
    }
  }
};

// Получение страницы с обработкой авторизации и ретраями
const fetchBatch = async page => {
  return retryRequest(async () => {
    try {
      const { data } = await serviceASG.post(`/prices?page=${page}`);
      return data.data.items;
    } catch (e) {
      const status = e.response?.status;
      if (status === 401) {
        console.log('Refreshing token...');
        const credentials = { login: ASG_LOGIN, password: ASG_PASSWORD };
        const resASG = await serviceASG.post('/auth/login', credentials);
        serviceASG.defaults.headers.common.Authorization = `Bearer ${resASG.data.access_token}`;
        const { data } = await serviceASG.post(`/prices?page=${page}`);
        return data.data.items;
      } else {
        throw e;
      }
    }
  });
};

// Массовое обновление товаров
const updateDatabase = async batch => {
  const bulkOps = batch.map(item => ({
    updateOne: {
      filter: { id: item.id },
      update: { $set: item },
      upsert: true,
    },
  }));

  if (bulkOps.length > 0) {
    await ASGProduct.bulkWrite(bulkOps);
  }
};

// Главная функция обновления БД
const DBUpdASGAllProducts = async (req, res) => {
  console.log('📦 Starting DB update...');
  const limit = pLimit(MAX_CONCURRENT_REQUESTS);
  const allIds = new Set();
  const failedPages = [];

  let currentPage = 1;
  let hasMoreData = true;

  try {
    while (hasMoreData) {
      const tasks = [];

      for (let i = 0; i < MAX_CONCURRENT_REQUESTS && hasMoreData; i++) {
        const page = currentPage++;

        tasks.push(
          limit(async () => {
            console.log(`➡️ Fetching page ${page}...`);
            try {
              const batch = await fetchBatch(page);

              if (batch.length > 0) {
                await updateDatabase(batch);
                batch.forEach(item => allIds.add(item.id));
                console.log(`✅ Page ${page} processed.`);
              } else {
                hasMoreData = false;
              }
            } catch (err) {
              const status = err?.response?.status;
              const data = err?.response?.data;
              console.error(
                `❌ Page ${page} failed. Status: ${status}, Message: ${err.message}`,
              );
              if (data) {
                console.error('↪️ Response data:', data);
              }
              failedPages.push(page);
            }
          }),
        );
      }

      await Promise.all(tasks);
    }

    if (failedPages.length > 0) {
      console.warn(
        `⚠️ Обновление завершено частично. Не удалось загрузить страницы: ${failedPages.join(', ')}`,
      );
      res.status(207).json({
        status: 'partial',
        code: 207,
        message: 'DB updated partially',
        failedPages,
      });
    } else {
      console.log('✅ Database updated successfully');
      res.json({
        status: 'success',
        code: 200,
        message: 'DB updated successfully',
      });
    }
  } catch (e) {
    console.error('🔥 Error during database update:', e.message);
    res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Failed to update database',
    });
  }
};

module.exports = DBUpdASGAllProducts;
