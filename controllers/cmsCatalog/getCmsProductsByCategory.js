const { ASGCategory } = require('../../models/asg/categories');
const { ASGProduct } = require('../../models/asg/products');

const getCmsProductsByCategory = async (req, res) => {
  const { id, page = 1, limit = 20, favorite } = req.query;
  const skip = (page - 1) * limit;

  const category = await ASGCategory.find({ id });

  try {
    // Формування фільтру
    const filter = { category_id: parseInt(id, 10) };
    if (favorite !== undefined) {
      filter.favorite = favorite === 'true';
    }

    const inStockFilter = { ...filter, count_warehouse_3: { $ne: '0' } };
    const outOfStockFilter = { ...filter, count_warehouse_3: '0' };

    const inStockProducts = await ASGProduct.aggregate([
      { $match: inStockFilter },
      {
        $lookup: {
          from: 'asgimages',
          localField: 'id',
          foreignField: 'product_id',
          as: 'images',
        },
      },
      {
        $addFields: {
          img: { $arrayElemAt: ['$images.images', 0] },
        },
      },
      { $unset: 'images' },
      { $skip: skip },
      { $limit: limit },
    ]);

    const remainingLimit = limit - inStockProducts.length;
    let outOfStockProducts = [];

    if (remainingLimit > 0) {
      outOfStockProducts = await ASGProduct.aggregate([
        { $match: outOfStockFilter },
        {
          $lookup: {
            from: 'asgimages',
            localField: 'id',
            foreignField: 'product_id',
            as: 'images',
          },
        },
        {
          $addFields: {
            img: { $arrayElemAt: ['$images.images', 0] },
          },
        },
        { $unset: 'images' },
        { $skip: Math.max(0, skip - inStockProducts.length) },
        { $limit: remainingLimit },
      ]);
    }

    const products = [...inStockProducts, ...outOfStockProducts];

    // Перетворюємо об'єкти
    const transformedProducts = products.map(product => {
      const marginValue = category && category?.margin ? category.margin : 10;
      const margin = marginValue / 100;

      const price_currency_980_to_number = parseFloat(
        product.price_currency_980,
      );

      const price_client = Math.ceil(
        price_currency_980_to_number + price_currency_980_to_number * margin,
      );

      return {
        _id: product._id,
        id: product.id,
        cid: product.cid,

        category: product.category,
        category_id: product.category_id,

        brand: product.brand,
        article: product.article,
        tecdoc_article: product.tecdoc_article,

        name: product.name,
        description: product.description,
        img: product.img ? [...product.img] : [],
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,

        count_warehouse_3: product.count_warehouse_3,
        price_supplier: product.price_currency_980,
        price_client,
        price_promo: product.price_promo,
        banner: product.banner,
        sale: product.sale,
      };
    });

    const totalInStockCount = await ASGProduct.countDocuments(inStockFilter);
    const totalOutOfStockCount =
      await ASGProduct.countDocuments(outOfStockFilter);
    const totalPages = Math.ceil(
      (totalInStockCount + totalOutOfStockCount) / limit,
    );

    res.json({
      status: 'OK',
      code: 200,
      products: transformedProducts,
      totalPages,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Failed to fetch products',
    });
  }
};

module.exports = getCmsProductsByCategory;
