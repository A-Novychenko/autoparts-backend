const { ASGCategory } = require('../../models/asg/categories');

// Рекурсивна функція для отримання вкладених категорій
const getChildrenCategories = async parentId => {
  // Знаходимо дочірні категорії
  const children = await ASGCategory.find({ parent_id: parentId });

  // Для кожної дочірньої категорії отримуємо її дочірні категорії
  const categoriesWithChildren = await Promise.all(
    children.map(async child => {
      const subChildren = await getChildrenCategories(child.id);
      return {
        ...child._doc, // Використовуємо _doc для доступу до даних документа
        childrenCategories: subChildren, // Додаємо дочірні категорії
      };
    }),
  );

  return categoriesWithChildren;
};

const getCmsAllCategories = async (req, res) => {
  // Знаходимо основні категорії (parent_id: 0)
  const mainCategories = await ASGCategory.find({ parent_id: 0 }).sort({
    id: 1,
  });

  // Для кожної основної категорії отримуємо дочірні категорії
  const categoriesWithChildren = await Promise.all(
    mainCategories.map(async mainCategory => {
      const childrenCategories = await getChildrenCategories(mainCategory.id);
      return {
        ...mainCategory._doc, // Використовуємо _doc для доступу до даних документа
        childrenCategories, // Додаємо дочірні категорії
      };
    }),
  );

  res.json({
    status: 'OK',
    code: 200,
    categories: categoriesWithChildren,
  });
};

module.exports = getCmsAllCategories;
