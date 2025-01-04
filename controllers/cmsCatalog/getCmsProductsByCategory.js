const { ASGProduct } = require('../../models/asg/products');

const { transformedProductsByCMS } = require('../../helpers');

const getCmsProductsByCategory = async (req, res) => {
  const { id, page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;

  const category_id = parseInt(id, 10);

  // Отримання та сортування товарів
  const products = await ASGProduct.aggregate([
    { $match: { category_id } },
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
        isInStock: {
          $cond: [{ $ne: ['$count_warehouse_3', '0'] }, 1, 0], // Поле для сортування
        },
        margin: {
          $ifNull: [{ $arrayElemAt: ['$categoryData.margin', 0] }, 10], // Значення за замовчуванням 10, якщо margin відсутній
        },
      },
    },
    { $unset: ['images', 'categoryData'] },
    { $sort: { isInStock: -1, id: 1 } }, // Спочатку в наявності, потім за id
    { $skip: skip },
    { $limit: limit },
  ]);

  // Трансформування отриманих товарів

  const transformedProducts = transformedProductsByCMS(products);

  // Загальна кількість товарів
  const totalProductsCount = await ASGProduct.countDocuments({ category_id });
  const totalPages = Math.ceil(totalProductsCount / limit);

  res.json({
    status: 'OK',
    code: 200,
    products: transformedProducts,
    totalPages,
  });
};

module.exports = getCmsProductsByCategory;
