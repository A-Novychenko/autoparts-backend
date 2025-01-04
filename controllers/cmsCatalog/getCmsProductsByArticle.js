const { ASGProduct } = require('../../models/asg/products');

const { transformedProductsByCMS } = require('../../helpers');

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
    const transformedProducts = transformedProductsByCMS(products);

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
