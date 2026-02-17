const fs = require('fs');
const path = require('path');
const { ASGCategory } = require('../models/asg/categories');
const { ASGProduct } = require('../models/asg/products');
const { Group } = require('../models/asg/groups');
const { generateSlugName, generateProductPath } = require('../helpers');

const BASE_PATHS = [
  { loc: '', changefreq: 'weekly', priority: '1.0' },
  { loc: '/vin-request', changefreq: 'monthly', priority: '0.5' },
  { loc: '/about', changefreq: 'yearly', priority: '0.5' },
  { loc: '/delivery', changefreq: 'yearly', priority: '0.4' },
  { loc: '/payment', changefreq: 'yearly', priority: '0.4' },
  { loc: '/return', changefreq: 'yearly', priority: '0.4' },
  { loc: '/news', changefreq: 'yearly', priority: '0.6' },
  { loc: '/user-agreement', changefreq: 'yearly', priority: '0.3' },
  { loc: '/brands', changefreq: 'weekly', priority: '0.9' },
  { loc: '/contacts', changefreq: 'yearly', priority: '0.5' },
];

const ITEMS_PER_PAGE = 20;
const ITEMS_PER_BATCH = 1000;
const MAX_URLS_PER_SITEMAP = 40000;
const SITEMAP_DIR = path.resolve(__dirname, '../public/sitemaps');

if (!fs.existsSync(SITEMAP_DIR)) {
  fs.mkdirSync(SITEMAP_DIR, { recursive: true });
}

// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ ПОИСКА ---

const fetchSearchUrls = () => {
  const popularQueries = [
    'CASTROL MAGNATEC 5W-40',
    'CASTROL',
    'гальмівні колодки',
    'фільтр',
    'амортизатор',
    'свічки запалювання',
    'акумулятор',
    'зчеплення',
    'стартер',
    'генератор',
    'паливний насос',
    'турбіна',
    'радіатор охолодження',
    'гальмівний диск',
    'тяга рульова',
    'шрус',
    'підшипник ступиці',
    'лампа фари',
    'термостат',
    'склоочисники',
    'антифриз',
  ];

  return popularQueries.map(query => ({
    loc: `/search-products/grid?searchQuery=${encodeURIComponent(query.toUpperCase())}`,
    changefreq: 'weekly',
    priority: '0.6',
    // Для поиска lastmod всегда текущий
    lastmod: new Date().toISOString(),
  }));
};

const getMainCategories = async () => ASGCategory.find({ parent_id: 0 }).lean();
const getCategories = async parentId =>
  ASGCategory.find({ parent_id: parentId }).lean();
const hasProducts = async categoryId => {
  const count = await ASGProduct.countDocuments({ category_id: categoryId });
  return count > 0;
};

// --- ГЕНЕРАЦИЯ ПУТЕЙ ---

// 1. Старые категории (если они еще используются параллельно с группами)
const fetchCategoriesPaths = async () => {
  const urls = [];
  const traverse = async (category, mainParent) => {
    const children = await getCategories(category.id);
    const currentSlug = `${generateSlugName(category.name)}--${category.id}`;
    const lastMod = category.updatedAt
      ? new Date(category.updatedAt).toISOString()
      : new Date().toISOString();

    if (!mainParent) {
      if (children.length > 0) {
        urls.push({
          loc: `/catalog/grid/${currentSlug}`,
          changefreq: 'weekly',
          priority: '0.7',
          lastmod: lastMod,
        });
        for (const child of children) await traverse(child, category);
      } else if (await hasProducts(category.id)) {
        const count = await ASGProduct.countDocuments({
          category_id: category.id,
        });
        const totalPages = Math.ceil(count / ITEMS_PER_PAGE) || 1;
        for (let page = 1; page <= totalPages; page++) {
          urls.push({
            loc: `/catalog/grid/${currentSlug}/${currentSlug}/page-${page}`,
            changefreq: 'daily',
            priority: '0.6',
            lastmod: lastMod,
          });
        }
      }
    } else if (children.length > 0) {
      const mainSlug = `${generateSlugName(mainParent.name)}--${mainParent.id}`;
      urls.push({
        loc: `/catalog/grid/${mainSlug}/${currentSlug}/page-1`,
        changefreq: 'weekly',
        priority: '0.6',
        lastmod: lastMod,
      });
      for (const child of children) await traverse(child, mainParent);
    } else if (await hasProducts(category.id)) {
      const mainSlug = `${generateSlugName(mainParent.name)}--${mainParent.id}`;
      const count = await ASGProduct.countDocuments({
        category_id: category.id,
      });
      const totalPages = Math.ceil(count / ITEMS_PER_PAGE) || 1;
      for (let page = 1; page <= totalPages; page++) {
        urls.push({
          loc: `/catalog/grid/${mainSlug}/${currentSlug}/page-${page}`,
          changefreq: 'daily',
          priority: '0.6',
          lastmod: lastMod,
        });
      }
    }
  };

  const mainCategories = await getMainCategories();
  for (const cat of mainCategories) {
    await traverse(cat, null);
  }
  return urls;
};

// 2. Новые группы (Оптимизированная версия)
const fetchGroupPaths = async () => {
  const urls = [];
  const baseUrl = '/groups';

  const allGroups = await Group.find({ isVisible: true }).lean();

  const getChildren = parentId => {
    return allGroups.filter(g => String(g.parent) === String(parentId));
  };

  const traverse = async (group, parentUrl) => {
    const currentUrl = `${parentUrl}/${group.slug}`;

    const groupLastMod = group.updatedAt
      ? new Date(group.updatedAt).toISOString()
      : new Date().toISOString();

    urls.push({
      loc: currentUrl,
      changefreq: 'weekly',
      priority: group.parent ? '0.7' : '0.8',
      lastmod: groupLastMod,
    });

    const children = getChildren(group._id);

    if (children.length > 0) {
      for (const child of children) {
        await traverse(child, currentUrl);
      }
    } else {
      // Leaf Node (нет подгрупп) -> проверяем пагинацию товаров

      const productQuery = { groupId: group._id };

      const count = await ASGProduct.countDocuments(productQuery);

      if (count > ITEMS_PER_PAGE) {
        const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
        // Страницы пагинации (начиная со 2-й)
        for (let page = 2; page <= totalPages; page++) {
          urls.push({
            loc: `${currentUrl}/page-${page}`,
            changefreq: 'daily',
            priority: '0.6',
            lastmod: new Date().toISOString(), // Пагинация может обновляться чаще
          });
        }
      }
    }
  };

  const rootGroups = allGroups.filter(g => !g.parent);
  for (const rootGroup of rootGroups) {
    await traverse(rootGroup, baseUrl);
  }

  console.log(`Сгенерировано URL для групп: ${urls.length}`);
  return urls;
};

// 3. Товары
const fetchProductPaths = async () => {
  const urls = [];
  let skip = 0;

  while (true) {
    // Добавили updatedAt в выборку
    const products = await ASGProduct.find({}, 'name brand _id updatedAt')
      .skip(skip)
      .limit(ITEMS_PER_BATCH)
      .lean();

    if (!products.length) break;

    for (const product of products) {
      urls.push({
        loc: generateProductPath({
          name: product.name,
          brand: product.brand,
          _id: product._id,
        }),
        changefreq: 'daily',
        priority: '0.8',
        // Теперь у товаров реальная дата обновления
        lastmod: product.updatedAt
          ? new Date(product.updatedAt).toISOString()
          : new Date().toISOString(),
      });
    }

    skip += products.length;
    console.log(`Обработано товаров: ${skip}`);
  }

  return urls;
};

const chunkArray = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

const generateSitemapIndexXml = (sitemapFiles, baseUrl) => {
  const lastMod = new Date().toISOString();
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapFiles.map(file => `  <sitemap><loc>${baseUrl}/sitemaps/${file}</loc><lastmod>${lastMod}</lastmod></sitemap>`).join('\n')}
</sitemapindex>`;
};

// --- ОСНОВНАЯ ФУНКЦИЯ ---

const generateSitemapFunc = async () => {
  const baseUrl = process.env.MAIN_SITE_URL;
  // Дата по умолчанию, если у элемента нет своей
  const defaultLastMod = new Date().toISOString();

  // Сбор всех ссылок
  const staticUrls = BASE_PATHS.map(item => ({
    ...item,
    lastmod: defaultLastMod, // Добавляем дату статике
  }));

  const categoryUrls = await fetchCategoriesPaths();
  const groupUrls = await fetchGroupPaths();
  const productUrls = await fetchProductPaths();
  const searchUrls = fetchSearchUrls();

  const allUrls = [
    ...staticUrls,
    ...categoryUrls,
    ...groupUrls,
    ...productUrls,
    ...searchUrls,
  ];

  console.log(`Всего URL для sitemap: ${allUrls.length}`);

  const chunks = chunkArray(allUrls, MAX_URLS_PER_SITEMAP);

  // Очистка старых файлов
  if (fs.existsSync(SITEMAP_DIR)) {
    fs.readdirSync(SITEMAP_DIR)
      .filter(f => f.startsWith('sitemap-') && f.endsWith('.xml'))
      .forEach(f => fs.unlinkSync(path.join(SITEMAP_DIR, f)));
  }

  // Генерация файлов
  const sitemapFiles = chunks.map((chunk, i) => {
    const filename = `sitemap-${i + 1}.xml`;

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${chunk
  .map(
    ({ loc, changefreq, priority, lastmod }) =>
      `  <url>
    <loc>${baseUrl}${loc}</loc>
    <lastmod>${lastmod || defaultLastMod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`;

    fs.writeFileSync(path.join(SITEMAP_DIR, filename), xml);
    console.log(`Сгенерирован файл: ${filename} с ${chunk.length} URL`);
    return filename;
  });

  // Генерация индекса
  const indexXml = generateSitemapIndexXml(sitemapFiles, baseUrl);
  fs.writeFileSync(path.join(SITEMAP_DIR, 'sitemap-index.xml'), indexXml);

  console.log('----------------------------------');
  console.log(`Файлов sitemap: ${sitemapFiles.length}`);
  console.log(`Общее количество URL: ${allUrls.length}`);
  console.log('----------------------------------');

  return sitemapFiles.length;
};

module.exports = generateSitemapFunc;
