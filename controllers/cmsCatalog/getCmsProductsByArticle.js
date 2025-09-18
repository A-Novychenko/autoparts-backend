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

  // Нормализация артикула
  const normalizedArticle = article.trim();

  // Поиск продуктов по частичному совпадению (регулярка, без учета регистра)
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
        img: { $arrayElemAt: ['$images.images', 0] }, // Первое изображение
      },
    },
    { $unset: 'images' },
  ]);

  const transformedProducts = transformedProductsByCMS(products);

  res.json({
    status: 'OK',
    code: 200,
    products: transformedProducts,
  });
};

module.exports = getCmsProductsByArticle;
