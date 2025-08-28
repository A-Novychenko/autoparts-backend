const { ASGProduct } = require('../../models/asg/products');

const { transformedProductsBySite } = require('../../helpers');
const { TopProduct } = require('../../models/orders/topProducts');

const getTopProducts = async (req, res) => {
  const productsIds = await TopProduct.find({});

  const topDocs = await TopProduct.find({});
  const productArticles = topDocs.map(doc => doc.tecdoc_article);

  if (productArticles.length === 0) {
    return res.json({
      status: 'OK',
      code: 200,
      products: [],
      message: 'Нет топовых товаров',
    });
  }

  // Пошук продуктів за артикулами з підключенням зображень
  const products = await ASGProduct.aggregate([
    { $match: { tecdoc_article: { $in: productArticles } } },
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
        img: { $arrayElemAt: ['$images.images', 0] }, // Беремо перше зображення
        margin: {
          $ifNull: [{ $arrayElemAt: ['$categoryData.margin', 0] }, 10], // Значення за замовчуванням 10, якщо margin відсутній
        },
      },
    },
    { $unset: ['images', 'categoryData'] }, // Видаляємо зайві дані
  ]);

  const transformedProducts = transformedProductsBySite(products);

  res.json({
    status: 'OK',
    code: 200,
    products: transformedProducts,
  });
};

module.exports = getTopProducts;
