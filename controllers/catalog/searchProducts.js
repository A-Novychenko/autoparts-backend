const { ASGProduct } = require('../../models/asg/products');
const { transformedProductsBySite, HttpError } = require('../../helpers');

const searchProducts = async (req, res) => {
  let { article } = req.body;

  if (!article || typeof article !== 'string') {
    throw HttpError(400, 'No search query provided');
  }

  try {
    article = decodeURIComponent(article).trim().toLowerCase();
  } catch (e) {
    console.log('e', e);
    throw HttpError(400, 'Invalid URI encoding');
  }

  let exactProductsRaw = [];
  let exactIds = [];

  // === 1. Пошук по tecdoc_article ===
  exactProductsRaw = await ASGProduct.aggregate([
    {
      $match: {
        $expr: {
          $or: [
            {
              $eq: [{ $toLower: '$tecdoc_article' }, article.toLowerCase()],
            },
            {
              $eq: [{ $toLower: '$article' }, article.toLowerCase()],
            },
          ],
        },
      },
    },
    ...getProductLookups(),
    {
      $addFields: {
        inStock: {
          $cond: {
            if: { $ne: ['$count_warehouse_3', '0'] },
            then: 1,
            else: 0,
          },
        },
      },
    },
    { $sort: { inStock: -1 } },
    { $limit: 100 },
  ]);

  exactIds = exactProductsRaw.map(p => p.id);

  // === 3. Якщо нічого — пошук по search_index ===
  let relatedProductsRaw = [];

  if (!exactProductsRaw.length) {
    const normalized = article
      .replace(/[^a-zа-яё0-9]+/gi, ' ')
      .replace(/\b(\d+w)[\s\-]?(\d+)\b/g, '$1$2') // 5w-40 → 5w40
      .trim();

    const words = normalized.split(/\s+/).filter(Boolean);

    if (words.length) {
      const conditions = words.map(word => ({
        search_index: { $regex: new RegExp(word, 'i') },
      }));

      relatedProductsRaw = await ASGProduct.aggregate([
        {
          $match: {
            $and: conditions,
          },
        },
        ...getProductLookups(),
        {
          $addFields: {
            inStock: {
              $cond: {
                if: { $ne: ['$count_warehouse_3', '0'] },
                then: 1,
                else: 0,
              },
            },
          },
        },
        { $sort: { inStock: -1 } },
        { $limit: 100 },
      ]);
    }
  } else {
    // Якщо точні є — шукаємо додаткові товари по search_index, але виключаємо знайдені ID
    const normalized = article
      .replace(/[^a-zа-яё0-9]+/gi, ' ')
      .replace(/\b(\d+w)[\s\-]?(\d+)\b/g, '$1$2')
      .trim();

    const words = normalized.split(/\s+/).filter(Boolean);

    if (words.length) {
      const conditions = words.map(word => ({
        search_index: { $regex: new RegExp(word, 'i') },
      }));

      relatedProductsRaw = await ASGProduct.aggregate([
        {
          $match: {
            $and: conditions,
            id: { $nin: exactIds },
          },
        },
        ...getProductLookups(),
        {
          $addFields: {
            inStock: {
              $cond: {
                if: { $ne: ['$count_warehouse_3', '0'] },
                then: 1,
                else: 0,
              },
            },
          },
        },
        { $sort: { inStock: -1 } },
        { $limit: 100 },
      ]);
    }
  }

  const exactProducts = transformedProductsBySite(exactProductsRaw);
  const relatedProducts = transformedProductsBySite(relatedProductsRaw);

  res.json({
    status: 'OK',
    code: 200,
    exactProducts,
    relatedProducts,
  });
};

function getProductLookups() {
  return [
    {
      $lookup: {
        from: 'asgimages',
        localField: 'id',
        foreignField: 'product_id',
        as: 'images',
      },
    },
    {
      $lookup: {
        from: 'asgcategories',
        localField: 'category_id',
        foreignField: 'id',
        as: 'categoryData',
      },
    },
    {
      $addFields: {
        img: { $arrayElemAt: ['$images.images', 0] },
        margin: {
          $ifNull: [{ $arrayElemAt: ['$categoryData.margin', 0] }, 10],
        },
      },
    },
    { $unset: ['images', 'categoryData'] },
  ];
}

module.exports = searchProducts;
