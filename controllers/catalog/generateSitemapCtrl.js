// const fs = require('fs');
// const path = require('path');
// const { generateSlugName, generateProductPath } = require('../../helpers');
// const { ASGCategory } = require('../../models/asg/categories');
// const { ASGProduct } = require('../../models/asg/products');

// const BASE_PATHS = [
//   { loc: '', changefreq: 'weekly', priority: '1.0' },
//   { loc: '/vin-request', changefreq: 'monthly', priority: '0.5' },
// ];

// const fetchSearchUrls = () => {
//   const popularQueries = [
//     'CASTROL MAGNATEC 5W-40',
//     'CASTROL',
//     'гальмівні колодки',
//     'фільтр',
//     'амортизатор',
//     'свічки запалювання',
//     'акумулятор',
//     'зчеплення',
//     'стартер',
//     'генератор',
//     'паливний насос',
//     'турбіна',
//     'радіатор охолодження',
//     'гальмівний диск',
//     'тяга рульова',
//     'шрус',
//     'підшипник ступиці',
//     'лампа фари',
//     'термостат',
//     'склоочисники',
//     'антифриз',
//   ];

//   return popularQueries.map(query => ({
//     loc: `/search-products/grid?searchQuery=${encodeURIComponent(query.toUpperCase())}`,
//     changefreq: 'weekly',
//     priority: '0.6',
//   }));
// };

// const ITEMS_PER_PAGE = 20;
// const ITEMS_PER_BATCH = 1000;
// const MAX_URLS_PER_SITEMAP = 40000;
// const SITEMAP_DIR = path.resolve(__dirname, '../../public/sitemaps');

// if (!fs.existsSync(SITEMAP_DIR)) {
//   fs.mkdirSync(SITEMAP_DIR, { recursive: true });
// }

// const getMainCategories = async () => ASGCategory.find({ parent_id: 0 }).lean();
// const getCategories = async parentId =>
//   ASGCategory.find({ parent_id: parentId }).lean();

// const hasProducts = async categoryId => {
//   const count = await ASGProduct.countDocuments({ category_id: categoryId });
//   return count > 0;
// };

// const fetchCategoriesPaths = async () => {
//   const urls = [];

//   const traverse = async (category, mainParent) => {
//     const children = await getCategories(category.id);
//     const currentSlug = `${generateSlugName(category.name)}--${category.id}`;

//     if (!mainParent) {
//       if (children.length > 0) {
//         urls.push({
//           loc: `/catalog/grid/${currentSlug}`,
//           changefreq: 'weekly',
//           priority: '0.7',
//         });

//         for (const child of children) {
//           await traverse(child, category);
//         }
//       } else if (await hasProducts(category.id)) {
//         const count = await ASGProduct.countDocuments({
//           category_id: category.id,
//         });
//         const totalPages = Math.ceil(count / ITEMS_PER_PAGE) || 1;

//         for (let page = 1; page <= totalPages; page++) {
//           urls.push({
//             loc: `/catalog/grid/${currentSlug}/${currentSlug}/page-${page}`,
//             changefreq: 'daily',
//             priority: '0.6',
//           });
//         }
//       }
//     } else if (children.length > 0) {
//       const mainSlug = `${generateSlugName(mainParent.name)}--${mainParent.id}`;
//       urls.push({
//         loc: `/catalog/grid/${mainSlug}/${currentSlug}/page-1`,
//         changefreq: 'weekly',
//         priority: '0.6',
//       });

//       for (const child of children) {
//         await traverse(child, mainParent);
//       }
//     } else if (await hasProducts(category.id)) {
//       const mainSlug = `${generateSlugName(mainParent.name)}--${mainParent.id}`;
//       const count = await ASGProduct.countDocuments({
//         category_id: category.id,
//       });
//       const totalPages = Math.ceil(count / ITEMS_PER_PAGE) || 1;

//       for (let page = 1; page <= totalPages; page++) {
//         urls.push({
//           loc: `/catalog/grid/${mainSlug}/${currentSlug}/page-${page}`,
//           changefreq: 'daily',
//           priority: '0.6',
//         });
//       }
//     }
//   };

//   const mainCategories = await getMainCategories();
//   for (const cat of mainCategories) {
//     await traverse(cat, null);
//   }

//   return urls;
// };

// const fetchProductPaths = async () => {
//   const urls = [];
//   let skip = 0;

//   while (true) {
//     const products = await ASGProduct.find({})
//       .skip(skip)
//       .limit(ITEMS_PER_BATCH)
//       .lean();
//     if (!products.length) break;

//     for (const product of products) {
//       urls.push({
//         loc: generateProductPath({
//           name: product.name,
//           brand: product.brand,
//           _id: product._id,
//         }),
//         changefreq: 'daily',
//         priority: '0.8',
//       });
//     }

//     skip += products.length;
//     console.log(`Обработано товаров: ${skip}`);
//   }

//   return urls;
// };

// const chunkArray = (arr, size) => {
//   const chunks = [];
//   for (let i = 0; i < arr.length; i += size) {
//     chunks.push(arr.slice(i, i + size));
//   }
//   return chunks;
// };

// const generateSitemapXml = (
//   urls,
//   baseUrl,
//   lastMod,
// ) => `<?xml version="1.0" encoding="UTF-8"?>
// <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
// ${urls.map(({ loc, changefreq, priority }) => `  <url><loc>${baseUrl}${loc}</loc><lastmod>${lastMod}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`).join('\n')}
// </urlset>`;

// const generateSitemapIndexXml = (sitemapFiles, baseUrl) => {
//   const lastMod = new Date().toISOString();
//   return `<?xml version="1.0" encoding="UTF-8"?>
// <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
// ${sitemapFiles.map(file => `  <sitemap><loc>${baseUrl}/sitemaps/${file}</loc><lastmod>${lastMod}</lastmod></sitemap>`).join('\n')}
// </sitemapindex>`;
// };

// const generateSitemapCtrl = async (req, res) => {
//   const baseUrl = process.env.MAIN_SITE_URL;
//   const lastMod = new Date().toISOString();

//   const staticUrls = BASE_PATHS;
//   const categoryUrls = await fetchCategoriesPaths();
//   const productUrls = await fetchProductPaths();
//   const searchUrls = fetchSearchUrls();

//   const allUrls = [
//     ...staticUrls,
//     ...categoryUrls,
//     ...productUrls,
//     ...searchUrls,
//   ];
//   console.log(`Всего URL для sitemap: ${allUrls.length}`);

//   const chunks = chunkArray(allUrls, MAX_URLS_PER_SITEMAP);

//   fs.readdirSync(SITEMAP_DIR)
//     .filter(f => f.startsWith('sitemap-') && f.endsWith('.xml'))
//     .forEach(f => fs.unlinkSync(path.join(SITEMAP_DIR, f)));

//   const sitemapFiles = chunks.map((chunk, i) => {
//     const filename = `sitemap-${i + 1}.xml`;
//     const xml = generateSitemapXml(chunk, baseUrl, lastMod);
//     fs.writeFileSync(path.join(SITEMAP_DIR, filename), xml);
//     console.log(`Сгенерирован файл: ${filename} с ${chunk.length} URL`);
//     return filename;
//   });

//   const indexXml = generateSitemapIndexXml(sitemapFiles, baseUrl);
//   fs.writeFileSync(path.join(SITEMAP_DIR, 'sitemap-index.xml'), indexXml);
//   console.log('Сгенерирован индексный sitemap-index.xml');
//   console.log('----------------------------------');
//   console.log(`Файлов sitemap: ${sitemapFiles.length}`);
//   console.log(`Поисковых URL: ${searchUrls.length}`);
//   console.log(`Общее количество URL: ${allUrls.length}`);
//   console.log('----------------------------------');

//   res.send(`✅ Sitemaps сгенерированы: ${sitemapFiles.length} файлов.`);
// };

// module.exports = generateSitemapCtrl;

const { generateSitemapFunc } = require('../../helpers');

const generateSitemapCtrl = async (req, res) => {
  const result = await generateSitemapFunc();

  res.send(`✅ Sitemaps сгенерированы: ${result} файлов.`);
};

module.exports = generateSitemapCtrl;
