const { ASGProduct } = require('../../models/asg/products');
const { transformedProductsByCMS } = require('../../helpers');

const getCmsProductsByArticle = async (req, res) => {
  const { article } = req.body;

  if (!article) {
    return res.status(400).json({
      status: 'ERROR',
      code: 400,
      message: 'Не передан артикул',
    });
  }

  const normalizedArticle = article.trim();

  // Ищем продукты
  const products = await ASGProduct.aggregate([
    {
      $match: {
        $or: [
          { tecdoc_article: { $regex: normalizedArticle, $options: 'i' } },
          { article: { $regex: normalizedArticle, $options: 'i' } },
        ],
      },
    },
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

    // 🔥 ДОБАВЛЯЕМ lookup для категорий
    {
      $lookup: {
        from: 'asgcategories', // имя коллекции категорий
        localField: 'category_id',
        foreignField: 'id', // предполагаю, что id в категории — это её идентификатор
        as: 'category',
      },
    },
    {
      $addFields: {
        margin: { $ifNull: [{ $arrayElemAt: ['$category.margin', 0] }, 16] }, // берём margin или 16, если нет категории
      },
    },
    { $unset: 'category' },
  ]);

  // Теперь у каждого продукта есть margin
  const transformedProducts = transformedProductsByCMS(products);

  res.json({
    status: 'OK',
    code: 200,
    products: transformedProducts,
  });
};

module.exports = getCmsProductsByArticle;
