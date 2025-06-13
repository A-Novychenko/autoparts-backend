const fs = require('fs');
const path = require('path');
const { generateSlugName, generateProductPath } = require('../../helpers');
const { ASGCategory } = require('../../models/asg/categories');
const { ASGProduct } = require('../../models/asg/products');

// Тип страницы                changefreq priority
// Главная                     weekly     1.0
// Категории                   weekly     0.7
// Подкатегории (с пагинацией) daily      0.6
// Продукты                    daily      0.8
// cart, checkout и др.        monthly    0.3–0.5

const BASE_PATHS = [
  { loc: '', changefreq: 'weekly', priority: '1.0' },
  { loc: '/cart', changefreq: 'monthly', priority: '0.3' },
  { loc: '/checkout', changefreq: 'monthly', priority: '0.4' },
  { loc: '/search-products', changefreq: 'daily', priority: '0.6' },
  { loc: '/product', changefreq: 'weekly', priority: '0.7' },
  { loc: '/vin-request', changefreq: 'monthly', priority: '0.5' },
];

const ITEMS_PER_PAGE = 20;
const ITEMS_PER_BATCH = 1000;
const MAX_URLS_PER_SITEMAP = 40000;

const SITEMAP_DIR = path.resolve(__dirname, '../../public/sitemaps');

if (!fs.existsSync(SITEMAP_DIR)) {
  fs.mkdirSync(SITEMAP_DIR, { recursive: true });
}

const getMainCategories = async () => {
  return ASGCategory.find({ parent_id: 0 }).lean();
};

const getCategories = async parentId => {
  return ASGCategory.find({ parent_id: parentId }).lean();
};

const fetchCategoriesPaths = async () => {
  const mainCategories = await getMainCategories();
  const urls = [];

  await Promise.all(
    mainCategories.map(async cat => {
      const id = cat.id;
      const name = cat.name;
      const parentSlug = `/catalog/grid/${generateSlugName(name)}--${id}`;

      urls.push({
        loc: parentSlug,
        changefreq: 'weekly',
        priority: '0.7',
      });

      const children = await getCategories(id);

      await Promise.all(
        children.map(async child => {
          const childSlug = `${generateSlugName(child.name)}--${child.id}`;
          const fullPath = `${parentSlug}/${childSlug}`;

          const count = await ASGProduct.countDocuments({
            category_id: child.id,
          });
          const totalPages = Math.ceil(count / ITEMS_PER_PAGE) || 1;

          for (let page = 1; page <= totalPages; page++) {
            urls.push({
              loc: `${fullPath}/page--${page}`,
              changefreq: 'daily',
              priority: '0.6',
            });
          }
        }),
      );
    }),
  );

  return urls;
};

const fetchProductPaths = async () => {
  const urls = [];
  let skip = 0;

  while (true) {
    const products = await ASGProduct.find({})
      .skip(skip)
      .limit(ITEMS_PER_BATCH)
      .lean();

    if (products.length === 0) break;

    products.forEach(product => {
      urls.push({
        loc: generateProductPath({
          name: product.name,
          brand: product.brand,
          _id: product._id,
        }),
        changefreq: 'daily',
        priority: '0.8',
      });
    });

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

const generateSitemapXml = (urls, baseUrl, lastMod) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ loc, changefreq, priority }) => `
  <url>
    <loc>${baseUrl}${loc}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
  )
  .join('')}
</urlset>`;
};

const generateSitemapIndexXml = (sitemapFiles, baseUrl) => {
  const lastMod = new Date().toISOString();
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapFiles
  .map(
    filename => `
  <sitemap>
    <loc>${baseUrl}/sitemaps/${filename}</loc>
    <lastmod>${lastMod}</lastmod>
  </sitemap>`,
  )
  .join('')}
</sitemapindex>`;
};

const getSitemap = async (req, res) => {
  const baseUrl = process.env.MAIN_SITE_URL || 'http://localhost:3000';
  const lastMod = new Date().toISOString();

  const staticUrls = BASE_PATHS;
  const categoryUrls = await fetchCategoriesPaths();
  const productUrls = await fetchProductPaths();

  const allUrls = [...staticUrls, ...categoryUrls, ...productUrls];

  console.log(`Всего URL для sitemap: ${allUrls.length}`);

  const chunks = chunkArray(allUrls, MAX_URLS_PER_SITEMAP);

  const oldFiles = fs.readdirSync(SITEMAP_DIR);
  oldFiles.forEach(f => {
    if (f.startsWith('sitemap-') && f.endsWith('.xml')) {
      fs.unlinkSync(path.join(SITEMAP_DIR, f));
    }
  });

  const sitemapFiles = [];
  for (let i = 0; i < chunks.length; i++) {
    const filename = `sitemap-${i + 1}.xml`;
    const xml = generateSitemapXml(chunks[i], baseUrl, lastMod);
    fs.writeFileSync(path.join(SITEMAP_DIR, filename), xml);
    sitemapFiles.push(filename);
    console.log(`Сгенерирован файл: ${filename} с ${chunks[i].length} URL`);
  }

  const indexXml = generateSitemapIndexXml(sitemapFiles, baseUrl);
  fs.writeFileSync(path.join(SITEMAP_DIR, 'sitemap-index.xml'), indexXml);
  console.log('Сгенерирован индексный sitemap-index.xml');

  console.log('----------------------------------');
  console.log(`Файлов sitemap: ${sitemapFiles.length}`);
  console.log(`Общее количество URL: ${allUrls.length}`);
  console.log('----------------------------------');
  res.send(`✅ Sitemaps сгенерированы: ${sitemapFiles.length} файлов.`);
};

module.exports = getSitemap;
