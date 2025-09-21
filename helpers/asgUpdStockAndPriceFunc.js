const pLimit = require('p-limit');

const { ASGProduct } = require('../models/asg/products');
const serviceASG = require('./serviceASG');

const { ASG_LOGIN, ASG_PASSWORD } = process.env;

const MAX_CONCURRENT_REQUESTS = 1;
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 2000;

// Авторизация
const ensureAuth = async () => {
  const auth = await serviceASG.post('/auth/login', {
    login: ASG_LOGIN,
    password: ASG_PASSWORD,
  });
  serviceASG.defaults.headers.common.Authorization = `Bearer ${auth.data.access_token}`;
};

// Задержка
const exponentialBackoff = attempt =>
  new Promise(resolve =>
    setTimeout(resolve, RETRY_DELAY_MS * Math.pow(2, attempt)),
  );

// Повтор запроса
const retryRequest = async (fn, retries = MAX_RETRIES) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (e) {
      const status = e?.response?.status;
      if (status === 401) {
        await ensureAuth();
        continue;
      }
      if (i < retries - 1 && [429, 500, 502, 504].includes(status)) {
        await exponentialBackoff(i);
      } else {
        throw e;
      }
    }
  }
};

// Получение страницы
const fetchBatch = async page => {
  return retryRequest(() => serviceASG.post(`/prices?page=${page}`)).then(
    res => res.data,
  );
};

// Обновление в БД
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
      upsert: false,
    },
  }));

  await ASGProduct.bulkWrite(ops, { ordered: false });
};

// Сбор ID и обновление страницы
const processPage = async (page, firstData = null, knownIds) => {
  const data = firstData || (await fetchBatch(page));
  const items = data?.data?.items || [];

  if (items.length > 0) {
    await updateStockAndPriceInDB(items);
    items.forEach(item => knownIds.add(item.id));
    console.log(`✅ Стр. ${page}: обновлено ${items.length}`);
    return true;
  } else {
    console.warn(`⚠️ Пустая страница ${page}`);
    return false;
  }
};

// Обнуление остатков для отсутствующих товаров
const resetMissingStocks = async knownIds => {
  const allExistingIds = await ASGProduct.distinct('id');

  const missingIds = allExistingIds.filter(id => !knownIds.has(id));
  if (missingIds.length === 0) {
    console.log('🟢 Нет отсутствующих товаров для обнуления.');
    return;
  }

  const ops = missingIds.map(id => ({
    updateOne: {
      filter: { id },
      update: {
        $set: {
          count_warehouse_3: '0',
          count_warehouse_4: '0',
        },
      },
    },
  }));

  await ASGProduct.bulkWrite(ops, { ordered: false });
  console.log(`🧹 Обнулены остатки у ${missingIds.length} товаров`);
};

// Главный контроллер
const asgUpdStockAndPriceFunc = async () => {
  console.log('📦 Старт обновления цен и остатков...');
  const limit = pLimit(MAX_CONCURRENT_REQUESTS);
  const failedPages = [];
  const knownIds = new Set();
  let updated = 0;

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
          const success = await processPage(
            page,
            page === 1 ? first : null,
            knownIds,
          );
          if (success) updated += perPage;
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

  // Повтор неудачных
  if (failedPages.length > 0) {
    console.warn(`♻️ Повторная попытка для ${failedPages.length} страниц...`);
    const retryTasks = failedPages.map(page =>
      limit(async () => {
        try {
          const success = await processPage(page, null, knownIds);
          if (success) updated += perPage;
        } catch (err) {
          console.error(`🚫 Повтор неудачен стр. ${page}: ${err.message}`);
        }
      }),
    );
    await Promise.all(retryTasks);
  }

  // Обнуление
  await resetMissingStocks(knownIds);

  return { failedPages, updated };
};

module.exports = asgUpdStockAndPriceFunc;
