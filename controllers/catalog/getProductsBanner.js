const { ASGProduct } = require('../../models/asg/products');

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

  const transformedProducts = products.map(product => {
    const margin = product.margin / 100;

    const price_currency_980_to_number = parseFloat(product.price_currency_980);

    const price = Math.ceil(
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
      price,
      price_promo: product.price_promo,
      banner: product.banner,
      sale: product.sale,
    };
  });

  res.json({
    status: 'OK',
    code: 200,
    products: transformedProducts,
  });
};

module.exports = getProductsBanner;
