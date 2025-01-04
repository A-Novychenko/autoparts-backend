const { ASGProduct } = require('../../models/asg/products');

const { transformedProductsBySite } = require('../../helpers');

const getProductsBanner = async (req, res) => {
  // Пошук продуктів за артикулами з підключенням зображень
  const products = await ASGProduct.aggregate([
    { $match: { banner: true } },
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

module.exports = getProductsBanner;
