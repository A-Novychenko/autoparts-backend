const { serviceASG } = require('../../helpers');
const ASGProduct = require('../../models/asg/products');
const pLimit = require('p-limit'); // Для обмеження паралельності запитів

const { ASG_LOGIN, ASG_PASSWORD } = process.env;

// Максимальна кількість одночасних запитів
const MAX_CONCURRENT_REQUESTS = 10;

// Функція для отримання даних із сервісу
const fetchBatch = async page => {
  try {
    const { data } = await serviceASG.post(`/prices?page=${page}`);
    return data.data.items; // Повертає масив об'єктів
  } catch (e) {
    if (e.response?.status === 401) {
      console.log('Refreshing token...');
      const credentials = { login: ASG_LOGIN, password: ASG_PASSWORD };
      const resASG = await serviceASG.post('/auth/login', credentials);
      serviceASG.defaults.headers.common.Authorization = `Bearer ${resASG.data.access_token}`;
      const { data } = await serviceASG.post(`/prices?page=${page}`);
      return data.data.items;
    } else {
      console.error(`Error fetching page ${page}:`, e.message);
      throw new Error('Failed to fetch data');
    }
  }
};

// Функція для оновлення бази даних
const updateDatabase = async batch => {
  const bulkOps = batch.map(item => ({
    updateOne: {
      filter: { id: item.id }, // Замінити `id` на унікальне поле вашої моделі
      update: { $set: item }, // Оновлення даних
      upsert: true, // Додати, якщо запису немає
    },
  }));

  if (bulkOps.length > 0) {
    await ASGProduct.bulkWrite(bulkOps);
  }
};

// Видалення застарілих даних
// const removeStaleData = async existingIds => {
//   await ASGProduct.deleteMany({ id: { $nin: existingIds } });
// };

// Основна функція для оновлення бази даних
const DBUpdASGAllProducts = async (req, res) => {
  console.log('Starting DB update...');
  const limit = pLimit(MAX_CONCURRENT_REQUESTS); // Ліміт на одночасні запити
  const allIds = new Set();
  let currentPage = 1;
  let hasMoreData = true;

  try {
    // Паралельне завантаження сторінок
    while (hasMoreData) {
      const tasks = [];
      for (let i = 0; i < MAX_CONCURRENT_REQUESTS && hasMoreData; i++) {
        const page = currentPage++;
        tasks.push(
          limit(async () => {
            console.log(`Fetching page ${page}...`);
            const batch = await fetchBatch(page);

            if (batch.length > 0) {
              await updateDatabase(batch);
              batch.forEach(item => allIds.add(item.id)); // Зберігаємо ID
            } else {
              hasMoreData = false; // Якщо порожній масив, закінчуємо
            }

            console.log(`Page ${page} processed.`);
          }),
        );
      }

      // Чекаємо завершення всіх завдань у цьому циклі
      await Promise.all(tasks);
    }

    // Видалення застарілих даних
    // console.log('Removing stale data...');
    // await removeStaleData(Array.from(allIds));

    console.log('Database updated successfully');
    res.json({
      status: 'success',
      code: 200,
      message: 'DB updated successfully',
    });
  } catch (e) {
    console.error('Error during database update:', e.message);
    res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Failed to update database',
    });
  }
};

module.exports = DBUpdASGAllProducts;
