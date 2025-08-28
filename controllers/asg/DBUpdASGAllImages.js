const { serviceASG } = require('../../helpers');
const ASGImage = require('../../models/asg/images');
const { ASGProduct } = require('../../models/asg/products');

const pLimit = require('p-limit');

const { ASG_LOGIN, ASG_PASSWORD } = process.env;
const MAX_CONCURRENT_REQUESTS = 1;

const fetchBatch = async (page, retryCount = 0) => {
  try {
    const { data } = await serviceASG.post(`/product-images?page=${page}`);
    return data.data;
  } catch (e) {
    if (e.response?.status === 401) {
      console.log('Refreshing token...');
      const credentials = { login: ASG_LOGIN, password: ASG_PASSWORD };
      const resASG = await serviceASG.post('/auth/login', credentials);
      serviceASG.defaults.headers.common.Authorization = `Bearer ${resASG.data.access_token}`;
      const { data } = await serviceASG.post(`/product-images?page=${page}`);
      return data.data;
    } else if (e.response?.status === 429 && retryCount < 5) {
      const delay = (retryCount + 1) * 5000; // 5s, 10s, 15s, ...
      console.warn(
        `429 Too Many Requests on page ${page}. Retry #${retryCount + 1} after ${delay}ms...`,
      );
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchBatch(page, retryCount + 1);
    } else {
      console.error(`Error fetching page ${page}:`, e.message);
      throw new Error('Failed to fetch data');
    }
  }
};

const updateDatabase = async batch => {
  const bulkOps = batch.map(item => ({
    updateOne: {
      filter: { product_id: item.product_id },
      update: { $set: item },
      upsert: true,
    },
  }));

  if (bulkOps.length > 0) {
    await ASGImage.bulkWrite(bulkOps);
  }
};

const DBUpdASGAllImages = async (req, res) => {
  console.log('Starting DB update...');
  const limit = pLimit(MAX_CONCURRENT_REQUESTS);
  const insertedIds = new Set();
  let currentPage = 1;
  let hasMoreData = true;

  try {
    const validProductIds = new Set(await ASGProduct.distinct('id'));
    console.log(`Loaded ${validProductIds.size} product_ids from DB`);

    while (hasMoreData) {
      const tasks = [];
      for (let i = 0; i < MAX_CONCURRENT_REQUESTS && hasMoreData; i++) {
        const page = currentPage++;
        tasks.push(
          limit(async () => {
            console.log(`Fetching page ${page}...`);
            const batch = await fetchBatch(page);

            const filteredBatch = batch.filter(item =>
              validProductIds.has(item.product_id),
            );

            if (filteredBatch.length > 0) {
              await updateDatabase(filteredBatch);
              filteredBatch.forEach(item => insertedIds.add(item.product_id));
            }

            if (batch.length === 0) {
              hasMoreData = false;
            }

            console.log(
              `Page ${page} processed. Total inserted so far: ${insertedIds.size}`,
            );
          }),
        );
      }

      await Promise.all(tasks);
    }

    const missingProductIds = Array.from(validProductIds).filter(
      id => !insertedIds.has(id),
    );

    console.log(
      `\n🟡 Пропущено ${missingProductIds.length} товаров без изображений.`,
    );

    res.json({
      status: 'success',
      code: 200,
      message: `Images updated for ${insertedIds.size} products`,
      missing: missingProductIds.length,
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

module.exports = DBUpdASGAllImages;
