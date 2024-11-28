const fetchImgs = require('../../helpers/fetchASGImgs');
const ASGImage = require('../../models/asg/images');
const ASGProduct = require('../../models/asg/products');

const getProducts = async (req, res) => {
  const { id, page = 1, limit = 20, favorite } = req.query;
  const skip = (page - 1) * limit;
  const filter = favorite === undefined ? null : { favorite };

  // Фільтри для наявних та відсутніх товарів
  const inStockFilter = { count_warehouse_3: { $ne: '0' } }; // Товари в наявності
  const outOfStockFilter = { count_warehouse_3: '0' }; // Товари без наявності

  // Паралельне завантаження товарів
  const [
    inStockProducts,
    outOfStockProducts,
    totalInStockCount,
    totalOutOfStockCount,
  ] = await Promise.all([
    ASGProduct.find({ category_id: id, ...filter, ...inStockFilter }, '', {
      skip,
      limit,
    }), // Продукти в наявності
    ASGProduct.find({ category_id: id, ...filter, ...outOfStockFilter }, '', {
      skip,
      limit,
    }), // Продукти без наявності
    ASGProduct.countDocuments({ category_id: id, ...filter, ...inStockFilter }), // Підраховуємо наявні
    ASGProduct.countDocuments({
      category_id: id,
      ...filter,
      ...outOfStockFilter,
    }), // Підраховуємо відсутні
  ]);

  // Створюємо масив результатів
  let products = [...inStockProducts]; // Починаємо з наявних товарів

  // Якщо наявних товарів недостатньо, додаємо відсутні до ліміту
  const remainingLimit = limit - inStockProducts.length;

  if (remainingLimit > 0) {
    const outOfStockToAdd = outOfStockProducts.slice(0, remainingLimit); // Беремо стільки відсутніх товарів, скільки ще можна додати
    products = [...inStockProducts, ...outOfStockToAdd];
  }

  // Зображення
  const productsIds = products.map(({ id }) => id);
  // const data = await fetchImgs(productsIds);
  // const imgs = data.data;

  const imgs = await ASGImage.find({
    product_id: { $in: productsIds },
  });

  const productsWithImg = products.map(product => {
    const imgIdx = imgs.findIndex(
      ({ product_id }) => product_id === product.id,
    );

    if (imgIdx === -1) {
      return product;
    }

    const img = imgs[imgIdx].images[0];
    return { ...product._doc, img };
  });

  // Загальна кількість товарів
  const totalPages = Math.ceil(
    (totalInStockCount + totalOutOfStockCount) / limit,
  );

  res.json({
    status: 'OK',
    code: 200,
    products: productsWithImg ? productsWithImg : products,
    totalPages,
  });
};

module.exports = getProducts;
