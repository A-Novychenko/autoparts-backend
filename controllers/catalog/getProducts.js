// // const ASGCategory = require('../../models/asg/categories');
// const fetchImgs = require('../../helpers/fetchASGImgs');
// const ASGProduct = require('../../models/asg/products');

// const getProducts = async (req, res) => {
//   //  const productsLength = await ASGProduct.find({ category_id: id })

//   // const products = await ASGProduct.find({ category_id: id }).limit(20);

//   const { id, page = 1, limit = 20, favorite } = req.query;
//   console.log('id', id);
//   const skip = (page - 1) * limit;
//   const filter = favorite === undefined ? null : { favorite };

//   // const [products, totalCount] = await Promise.all([
//   //   // ASGProduct.find({ category_id: id }).limit(20),
//   //   ASGProduct.find({ category_id: id, ...filter }, '', {
//   //     skip,
//   //     limit,
//   //   }),
//   //   ASGProduct.countDocuments({ category_id: id }),
//   // ]);

//   // Параметр для фільтрації і сортування
//   const filterAvailability = { count_warehouse_3: { $ne: '0' } }; // Фільтр на наявність товару (count_warehouse_3 не повинно бути "0")
//   const sort = { count_warehouse_3: -1 }; // Спочатку продукти з більшими значеннями (тобто більше товару)

//   const [products, totalCount] = await Promise.all([
//     ASGProduct.find({ category_id: id, ...filter, ...filterAvailability }, '', {
//       skip,
//       limit,
//       sort, // Додаємо сортування
//     }),
//     ASGProduct.countDocuments({
//       category_id: id,
//       ...filter,
//       ...filterAvailability,
//     }),
//   ]);

//   // const totalPages = totalCount / 20;
//   const totalPages = Math.ceil(totalCount / 20);

//   console.log('totalPages', totalPages);

//   const productsIds = products.map(({ id }) => id);
//   // console.log('productsIds', productsIds);

//   const data = await fetchImgs(productsIds);

//   const imgs = data.data;

//   // console.log('imgs', imgs);

//   const productsWithImg = products.map(product => {
//     const imgIdx = imgs.findIndex(
//       ({ product_id }) => product_id === product.id,
//     );

//     if (imgIdx === -1) {
//       return product;
//     }

//     const img = imgs[imgIdx].images[0];

//     const productWithImg = { ...product._doc, img };

//     // console.log('productWithImg', productWithImg);

//     return productWithImg;
//   });

//   res.json({
//     status: 'OK',
//     code: 200,
//     products: productsWithImg,
//     // products,
//     totalPages,
//   });
// };

// module.exports = getProducts;

// const ASGCategory = require('../../models/asg/categories');
const fetchImgs = require('../../helpers/fetchASGImgs');
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
  const data = await fetchImgs(productsIds);
  const imgs = data.data;

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
