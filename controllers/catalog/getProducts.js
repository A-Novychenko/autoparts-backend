// const ASGProduct = require('../../models/asg/products');

// const getProducts = async (req, res) => {
//   const { id, page = 1, limit = 20, favorite } = req.query;
//   const skip = (page - 1) * limit;

//   try {
//     // Формування фільтру
//     const filter = { category_id: parseInt(id, 10) }; // Переконайтесь, що id — це число
//     if (favorite !== undefined) {
//       filter.favorite = favorite === 'true'; // Якщо favorite передано, додаємо його до фільтру
//     }

//     // Логіка для відбору товарів
//     const inStockFilter = { ...filter, count_warehouse_3: { $ne: '0' } }; // Товари в наявності
//     const outOfStockFilter = { ...filter, count_warehouse_3: '0' }; // Товари без наявності

//     // Отримуємо товари в наявності
//     const inStockProducts = await ASGProduct.aggregate([
//       { $match: inStockFilter },
//       {
//         $lookup: {
//           from: 'asgimages',
//           localField: 'id',
//           foreignField: 'product_id',
//           as: 'images',
//         },
//       },
//       {
//         $addFields: {
//           img: { $arrayElemAt: ['$images.images', 0] },
//         },
//       },
//       { $unset: 'images' },
//       { $skip: skip }, // Пропускаємо записи на основі сторінки
//       { $limit: limit }, // Лімітуємо кількість записів
//     ]);

//     // Якщо наявних товарів недостатньо, добираємо відсутні
//     const remainingLimit = limit - inStockProducts.length;
//     let outOfStockProducts = [];

//     if (remainingLimit > 0) {
//       outOfStockProducts = await ASGProduct.aggregate([
//         { $match: outOfStockFilter },
//         {
//           $lookup: {
//             from: 'asgimages',
//             localField: 'id',
//             foreignField: 'product_id',
//             as: 'images',
//           },
//         },
//         {
//           $addFields: {
//             img: { $arrayElemAt: ['$images.images', 0] },
//           },
//         },
//         { $unset: 'images' },
//         { $skip: Math.max(0, skip - inStockProducts.length) }, // Коригуємо пропуск
//         { $limit: remainingLimit }, // Лімітуємо до залишкового ліміту
//       ]);
//     }

//     // Підрахунок загальної кількості товарів
//     const totalInStockCount = await ASGProduct.countDocuments(inStockFilter);
//     const totalOutOfStockCount =
//       await ASGProduct.countDocuments(outOfStockFilter);
//     const totalPages = Math.ceil(
//       (totalInStockCount + totalOutOfStockCount) / limit,
//     );

//     // Об'єднуємо результати
//     const products = [...inStockProducts, ...outOfStockProducts];

//     console.log('products[0]', products[0]);

//     res.json({
//       status: 'OK',
//       code: 200,
//       products,
//       totalPages,
//     });
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     res.status(500).json({
//       status: 'error',
//       code: 500,
//       message: 'Failed to fetch products',
//     });
//   }
// };

// module.exports = getProducts;

const ASGProduct = require('../../models/asg/products');

const getProducts = async (req, res) => {
  const { id, page = 1, limit = 20, favorite } = req.query;
  const skip = (page - 1) * limit;

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
      price: Math.ceil(parseFloat(product.price_currency_980) * 1.1),
      count_warehouse_3: product.count_warehouse_3,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      img: product.img ? [...product.img] : [],
    }));

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

module.exports = getProducts;
