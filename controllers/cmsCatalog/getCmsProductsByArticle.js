const { ASGProduct } = require('../../models/asg/products');

const getCmsProductsByArticle = async (req, res) => {
  const { article } = req.body;

  try {
    // Формування фільтру для артикула
    const filter = {
      $or: [{ tecdoc_article: article }, { article }],
    };

    // Пошук продуктів за артикулами з підключенням зображень
    const products = await ASGProduct.aggregate([
      { $match: filter },
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
          img: { $arrayElemAt: ['$images.images', 0] }, // Беремо перше зображення
        },
      },
      { $unset: 'images' }, // Видаляємо зайві дані
    ]);

    // Перетворення об'єктів продуктів
    const transformedProducts = products.map(product => ({
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
      price: Math.ceil(parseFloat(product.price_currency_980) * 1.1), // Перерахунок ціни
      price_asg: parseFloat(product.price_currency_980),
      count_warehouse_3: product.count_warehouse_3,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      img: product.img ? [...product.img] : [], // Перетворення зображень
    }));

    res.json({
      status: 'OK',
      code: 200,
      products: transformedProducts,
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

module.exports = getCmsProductsByArticle;
