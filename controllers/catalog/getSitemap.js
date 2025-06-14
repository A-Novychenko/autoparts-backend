// const fs = require('fs');
// const path = require('path');
// const { generateSlugName, generateProductPath } = require('../../helpers');
// const { ASGCategory } = require('../../models/asg/categories');
// const { ASGProduct } = require('../../models/asg/products');

// // // // Тип страницы                changefreq priority
// // // // Главная                     weekly     1.0
// // // // Категории                   weekly     0.7
// // // // Подкатегории (с пагинацией) daily      0.6
// // // // Продукты                    daily      0.8
// // // // cart, checkout и др.        monthly    0.3–0.5

// const BASE_PATHS = [
//   { loc: '', changefreq: 'weekly', priority: '1.0' },
//   { loc: '/cart', changefreq: 'monthly', priority: '0.3' },
//   { loc: '/checkout', changefreq: 'monthly', priority: '0.4' },
//   { loc: '/checkout/result', changefreq: 'monthly', priority: '0.4' },
//   { loc: '/search-products', changefreq: 'daily', priority: '0.6' },
//   { loc: '/vin-request', changefreq: 'monthly', priority: '0.5' },
// ];

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
//         // Категория без вложений, но с товарами
//         const count = await ASGProduct.countDocuments({
//           category_id: category.id,
//         });
//         const totalPages = Math.ceil(count / ITEMS_PER_PAGE) || 1;

//         for (let page = 1; page <= totalPages; page++) {
//           urls.push({
//             loc: `/catalog/grid/${currentSlug}/${currentSlug}/page--${page}`,
//             changefreq: 'daily',
//             priority: '0.6',
//           });
//         }
//       }
//     } else if (children.length > 0) {
//       for (const child of children) {
//         await traverse(child, mainParent);
//       }
//     } else if (await hasProducts(category.id)) {
//       // Конечная подкатегория с товарами
//       const mainSlug = `${generateSlugName(mainParent.name)}--${mainParent.id}`;
//       const count = await ASGProduct.countDocuments({
//         category_id: category.id,
//       });
//       const totalPages = Math.ceil(count / ITEMS_PER_PAGE) || 1;

//       for (let page = 1; page <= totalPages; page++) {
//         urls.push({
//           loc: `/catalog/grid/${mainSlug}/${currentSlug}/page--${page}`,
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

// const getSitemap = async (req, res) => {
//   const baseUrl = process.env.MAIN_SITE_URL || 'http://localhost:3000';
//   const lastMod = new Date().toISOString();

//   const staticUrls = BASE_PATHS;
//   const categoryUrls = await fetchCategoriesPaths();
//   const productUrls = await fetchProductPaths();

//   const allUrls = [...staticUrls, ...categoryUrls, ...productUrls];
//   console.log(`Всего URL для sitemap: ${allUrls.length}`);

//   const chunks = chunkArray(allUrls, MAX_URLS_PER_SITEMAP);

//   fs.readdirSync(SITEMAP_DIR)
//     .filter(f => f.startsWith('sitemap-') && f.endsWith('.xml'))
//     .forEach(f => fs.unlinkSync(path.join(SITEMAP_DIR, f)));

//   const indexPath = path.join(SITEMAP_DIR, 'sitemap-index.xml');
//   if (fs.existsSync(indexPath)) fs.unlinkSync(indexPath);

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
//   console.log(`Общее количество URL: ${allUrls.length}`);
//   console.log('----------------------------------');

//   res.send(`✅ Sitemaps сгенерированы: ${sitemapFiles.length} файлов.`);
// };

// module.exports = getSitemap;

const fs = require('fs');
const path = require('path');
const { generateSlugName, generateProductPath } = require('../../helpers');
const { ASGCategory } = require('../../models/asg/categories');
const { ASGProduct } = require('../../models/asg/products');

const BASE_PATHS = [
  { loc: '', changefreq: 'weekly', priority: '1.0' },
  { loc: '/cart', changefreq: 'monthly', priority: '0.3' },
  { loc: '/checkout', changefreq: 'monthly', priority: '0.4' },
  { loc: '/checkout/result', changefreq: 'monthly', priority: '0.4' },
  { loc: '/search-products', changefreq: 'daily', priority: '0.6' },
  { loc: '/vin-request', changefreq: 'monthly', priority: '0.5' },
];

const ITEMS_PER_PAGE = 20;
const ITEMS_PER_BATCH = 1000;
const MAX_URLS_PER_SITEMAP = 40000;
const SITEMAP_DIR = path.resolve(__dirname, '../../public/sitemaps');

if (!fs.existsSync(SITEMAP_DIR)) {
  fs.mkdirSync(SITEMAP_DIR, { recursive: true });
}

const getMainCategories = async () => ASGCategory.find({ parent_id: 0 }).lean();
const getCategories = async parentId =>
  ASGCategory.find({ parent_id: parentId }).lean();

const hasProducts = async categoryId => {
  const count = await ASGProduct.countDocuments({ category_id: categoryId });
  return count > 0;
};

async function* fetchCategoryUrls() {
  async function* traverse(category, mainParent) {
    const children = await getCategories(category.id);
    const currentSlug = `${generateSlugName(category.name)}--${category.id}`;

    if (!mainParent) {
      if (children.length > 0) {
        yield {
          loc: `/catalog/grid/${currentSlug}`,
          changefreq: 'weekly',
          priority: '0.7',
        };
        for (const child of children) {
          yield* traverse(child, category);
        }
      } else if (await hasProducts(category.id)) {
        const count = await ASGProduct.countDocuments({
          category_id: category.id,
        });
        const totalPages = Math.ceil(count / ITEMS_PER_PAGE) || 1;

        for (let page = 1; page <= totalPages; page++) {
          yield {
            loc: `/catalog/grid/${currentSlug}/${currentSlug}/page--${page}`,
            changefreq: 'daily',
            priority: '0.6',
          };
        }
      }
    } else if (children.length > 0) {
      for (const child of children) {
        yield* traverse(child, mainParent);
      }
    } else if (await hasProducts(category.id)) {
      const mainSlug = `${generateSlugName(mainParent.name)}--${mainParent.id}`;
      const count = await ASGProduct.countDocuments({
        category_id: category.id,
      });
      const totalPages = Math.ceil(count / ITEMS_PER_PAGE) || 1;

      for (let page = 1; page <= totalPages; page++) {
        yield {
          loc: `/catalog/grid/${mainSlug}/${currentSlug}/page--${page}`,
          changefreq: 'daily',
          priority: '0.6',
        };
      }
    }
  }

  const mainCategories = await getMainCategories();
  for (const cat of mainCategories) {
    yield* traverse(cat, null);
  }
}

async function* fetchProductUrls() {
  let skip = 0;

  while (true) {
    const products = await ASGProduct.find({})
      .skip(skip)
      .limit(ITEMS_PER_BATCH)
      .lean();
    if (!products.length) break;

    for (const product of products) {
      yield {
        loc: generateProductPath({
          name: product.name,
          brand: product.brand,
          _id: product._id,
        }),
        changefreq: 'daily',
        priority: '0.8',
      };
    }

    skip += products.length;
    console.log(`Обработано товаров: ${skip}`);
  }
}

const writeSitemapChunk = (urls, baseUrl, lastMod, index) => {
  const filename = `sitemap-${index}.xml`;
  const stream = fs.createWriteStream(path.join(SITEMAP_DIR, filename));
  stream.write(`<?xml version="1.0" encoding="UTF-8"?>\n`);
  stream.write(
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`,
  );
  for (const { loc, changefreq, priority } of urls) {
    stream.write(
      `  <url><loc>${baseUrl}${loc}</loc><lastmod>${lastMod}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>\n`,
    );
  }
  stream.write(`</urlset>`);
  stream.end();
  return filename;
};

const writeSitemapIndex = (sitemapFiles, baseUrl) => {
  const lastMod = new Date().toISOString();
  const indexXml =
    `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    sitemapFiles
      .map(
        f =>
          `  <sitemap><loc>${baseUrl}/sitemaps/${f}</loc><lastmod>${lastMod}</lastmod></sitemap>`,
      )
      .join('\n') +
    `\n</sitemapindex>`;
  fs.writeFileSync(path.join(SITEMAP_DIR, 'sitemap-index.xml'), indexXml);
};

const getSitemap = async (req, res) => {
  const baseUrl = process.env.MAIN_SITE_URL || 'http://localhost:3000';
  const lastMod = new Date().toISOString();

  // Очистка старых sitemap файлов
  fs.readdirSync(SITEMAP_DIR)
    .filter(f => f.startsWith('sitemap-') && f.endsWith('.xml'))
    .forEach(f => fs.unlinkSync(path.join(SITEMAP_DIR, f)));

  const indexPath = path.join(SITEMAP_DIR, 'sitemap-index.xml');
  if (fs.existsSync(indexPath)) fs.unlinkSync(indexPath);

  const sitemapFiles = [];
  let chunk = [];
  let index = 1;

  const flushChunk = () => {
    const file = writeSitemapChunk(chunk, baseUrl, lastMod, index);
    sitemapFiles.push(file);
    console.log(`Сгенерирован файл: ${file} с ${chunk.length} URL`);
    chunk = [];
    index++;
  };

  // 1. Статичні URL
  for (const url of BASE_PATHS) {
    chunk.push(url);
  }

  // 2. Категорії
  for await (const url of fetchCategoryUrls()) {
    chunk.push(url);
    if (chunk.length >= MAX_URLS_PER_SITEMAP) flushChunk();
  }

  // 3. Продукти
  for await (const url of fetchProductUrls()) {
    chunk.push(url);
    if (chunk.length >= MAX_URLS_PER_SITEMAP) flushChunk();
  }

  // 4. Останній шматок, якщо залишився
  if (chunk.length > 0) flushChunk();

  // 5. Індексний файл
  writeSitemapIndex(sitemapFiles, baseUrl);

  console.log('✅ sitemap-index.xml сгенерирован');
  console.log(`📄 Файлов: ${sitemapFiles.length}`);
  res.send(`✅ Sitemaps сгенерированы: ${sitemapFiles.length} файлов.`);
};

module.exports = getSitemap;
