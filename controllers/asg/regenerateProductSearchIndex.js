const { ASGProduct } = require('../../models/asg/products');
const { ASGCategory } = require('../../models/asg/categories'); // Подключите, если ещё не подключено

const BATCH_SIZE = 5000;

const oilWords = ['масло', 'олива', 'мастило'];
const batteryWords = [
  'акб',
  'акумулятор',
  'акум',
  'акумуляторна',
  'батарея',
  'автоакб',
  'автоакум',
];

const HEAD_CATEGORY_WORDS = {
  1: oilWords,
  4: batteryWords,
};

// Строим map всех категорий: id => parent_id
async function getCategoryMap() {
  const categories = await ASGCategory.find({}, { id: 1, parent_id: 1 }).lean();
  const map = {};
  for (const cat of categories) {
    map[cat.id] = cat.parent_id;
  }
  return map;
}

function findRootCategory(categoryId, categoryMap) {
  let current = categoryId;
  const visited = new Set();
  while (categoryMap[current] !== 0 && !visited.has(current)) {
    visited.add(current);
    current = categoryMap[current];
  }
  return current;
}

function normalizeSearchIndex(doc, additionalWords = []) {
  const text = `
    ${doc.name || ''}
    ${doc.description || ''}
    ${doc.brand || ''}
    ${doc.category || ''}
  `
    .toLowerCase()
    .replace(/[^a-zа-яіїєґ0-9\s\-\/]+/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const oilMatches = [...text.matchAll(/\b(\d{1,2}w)[\s\-\/]?(\d{2})\b/gi)];
  const oilVariants = new Set();

  for (const [, wPart, num] of oilMatches) {
    oilVariants.add(`${wPart}-${num}`);
    oilVariants.add(`${wPart} ${num}`);
    oilVariants.add(`${wPart}${num}`);
  }

  return `${text} ${[...oilVariants].join(' ')} ${additionalWords.join(' ')}`.trim();
}

const regenerateProductSearchIndex = async (req, res) => {
  console.log(
    '🔄 Починаємо оновлення search_index з урахуванням головної категорії...',
  );

  const categoryMap = await getCategoryMap();
  const cursor = ASGProduct.find(
    {},
    { name: 1, description: 1, brand: 1, category: 1, id: 1, category_id: 1 },
  ).cursor();

  const bulk = [];
  let processed = 0;

  for await (const doc of cursor) {
    const rootId = findRootCategory(doc.category_id, categoryMap);
    const additionalWords = HEAD_CATEGORY_WORDS[rootId] || [];

    const searchIndex = normalizeSearchIndex(doc, additionalWords);

    bulk.push({
      updateOne: {
        filter: { id: doc.id },
        update: { $set: { search_index: searchIndex } },
      },
    });

    if (bulk.length >= BATCH_SIZE) {
      await ASGProduct.bulkWrite(bulk, { ordered: false });
      processed += bulk.length;
      console.log(`✅ Оброблено: ${processed}`);
      bulk.length = 0;
    }
  }

  if (bulk.length > 0) {
    await ASGProduct.bulkWrite(bulk, { ordered: false });
    processed += bulk.length;
  }

  console.log(
    `🎯 Готово. Оновлено ${processed} товарів з урахуванням головної категорії.`,
  );
  res.json({ status: 'success', updated: processed });
};

module.exports = regenerateProductSearchIndex;
