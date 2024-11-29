const { ASGCategory } = require('../../models/asg/categories');

const getAllCategories = async (req, res) => {
  const { id } = req.query;

  // console.log('id', id);

  const categories = await ASGCategory.find({ parent_id: id });

  // console.log('categories', categories);

  res.json({
    status: 'OK',
    code: 200,
    categories,
  });
};

module.exports = getAllCategories;

// const ASGCategory = require('../../models/asg/categories');

// const getAllCategories = async (req, res) => {
//   const { id } = req.query;

//   try {
//     const categories = await ASGCategory.aggregate([
//       { $match: { parent_id: parseInt(id, 10) } }, // Перетворюємо id на число
//       {
//         $lookup: {
//           from: 'asgimages', // Колекція зображень
//           localField: 'id', // Поле категорії
//           foreignField: 'product_id', // Поле у зображеннях
//           as: 'images', // Додаємо поле зображень
//         },
//       },
//       {
//         $addFields: {
//           img: {
//             $arrayElemAt: ['$images.images', 0], // Додаємо перше зображення як рядок
//           },
//         },
//       },
//       { $unset: 'images' }, // Видаляємо зайве поле `images`
//     ]);

//     res.json({
//       status: 'OK',
//       code: 200,
//       categories,
//     });
//   } catch (error) {
//     console.error('Error fetching categories:', error);
//     res.status(500).json({
//       status: 'error',
//       code: 500,
//       message: 'Failed to fetch categories',
//     });
//   }
// };

// module.exports = getAllCategories;
