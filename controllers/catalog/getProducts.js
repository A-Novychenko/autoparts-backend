const { ASGProduct } = require('../../models/asg/products');
const { transformedProductsBySite } = require('../../helpers');

const totalPagesCache = new Map();

const getProducts = async (req, res) => {
  try {
    const { id, page = 1, limit = 20 } = req.query;

    const numericLimit = Math.max(1, parseInt(limit, 10));
    const numericPage = Math.max(1, parseInt(page, 10));
    const category_id = parseInt(id, 10);

    if (isNaN(category_id)) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Invalid category ID',
      });
    }

    const skip = (numericPage - 1) * numericLimit;
    const cacheKey = `${category_id}:${numericLimit}`;
    let totalProductsCount;
    let totalPages;

    if (totalPagesCache.has(cacheKey)) {
      const cached = totalPagesCache.get(cacheKey);
      totalProductsCount = cached.count;
      totalPages = cached.pages;
    } else {
      totalProductsCount = await ASGProduct.countDocuments({ category_id });
      totalPages = Math.max(1, Math.ceil(totalProductsCount / numericLimit));
      totalPagesCache.set(cacheKey, {
        count: totalProductsCount,
        pages: totalPages,
      });
      setTimeout(() => totalPagesCache.delete(cacheKey), 5 * 60 * 1000);
    }

    console.log(
      `[getProducts] category_id=${category_id}, page=${numericPage}, skip=${skip}`,
    );

    const isHighPage = numericPage > 1000;

    const pipeline = [
      { $match: { category_id } },
      {
        $addFields: {
          isInStock: { $cond: [{ $ne: ['$count_warehouse_3', '0'] }, 1, 0] },
        },
      },
      ...(isHighPage ? [] : [{ $sort: { isInStock: -1, id: 1 } }]),
      { $skip: skip },
      { $limit: numericLimit },
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

    const products = await ASGProduct.aggregate(pipeline, {
      allowDiskUse: true, // 💡 ВАЖЛИВО: Ось правильне місце
    });

    const transformedProducts = transformedProductsBySite(products);

    return res.status(200).json({
      status: 'OK',
      code: 200,
      products: transformedProducts,
      totalPages,
    });
  } catch (error) {
    console.error('[getProducts error]:', error);
    return res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Server error',
    });
  }
};

module.exports = getProducts;
