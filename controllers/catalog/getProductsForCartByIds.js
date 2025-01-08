const { ASGProduct } = require('../../models/asg/products');

const { transformedProductsBySite } = require('../../helpers');

const getProductsForCartByIds = async (req, res) => {
  const { ids } = req.query;

  const productIds = Array.isArray(ids)
    ? ids.map(id => Number(id)) // Якщо це масив
    : ids.split(',').map(id => Number(id.trim())); // Якщо це рядок

  console.log('productIds', productIds);

  // Отримання та сортування товарів
  const products = await ASGProduct.aggregate([
    { $match: { id: { $in: productIds } } },

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
        isInStock: {
          $cond: [{ $ne: ['$count_warehouse_3', '0'] }, 1, 0], // Поле для сортування
        },
        margin: {
          $ifNull: [{ $arrayElemAt: ['$categoryData.margin', 0] }, 10], // Значення за замовчуванням 10, якщо margin відсутній
        },
      },
    },
    { $unset: ['categoryData'] },
  ]);

  // Перетворюємо об'єкти
  const transformedProducts = transformedProductsBySite(products);

  res.json({
    status: 'OK',
    code: 200,
    products: transformedProducts,
  });
};

module.exports = getProductsForCartByIds;
