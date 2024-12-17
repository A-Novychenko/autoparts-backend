const { ASGCategory } = require('../../models/asg/categories');

const { HttpError } = require('../../helpers');

// Рекурсивно отримати всі ID дочірніх категорій
const getAllCategoryIds = async parentId => {
  const categories = await ASGCategory.find({ parent_id: parentId });
  const ids = categories.map(cat => cat.id);

  for (const category of categories) {
    const childIds = await getAllCategoryIds(category.id);
    ids.push(...childIds);
  }

  return ids;
};

// Перетворити список категорій у дерево

const buildCategoryTree = (categories, parentId = 0) => {
  console.log('Building tree for parentId:', parentId);

  // Фільтрація категорій
  const filteredCategories = categories.filter(cat => {
    console.log(
      `Checking category: ${cat.id}, parent_id: ${cat.parent_id}, target parentId: ${parentId}`,
    );
    return cat.parent_id === parentId; // Порівняння id як чисел
  });

  console.log(
    'Filtered categories:',
    filteredCategories.map(cat => cat.id),
  );

  // Рекурсивне формування дерева
  return filteredCategories.map(cat => ({
    ...cat.toObject(), // Перетворення Mongoose-моделі у звичайний об'єкт
    childrenCategories: buildCategoryTree(categories, cat.id),
  }));
};

const updCmsCategoryMargin = async (req, res) => {
  const { id, margin } = req.body;

  // Знайти категорію за ID
  const category = await ASGCategory.findOne({ id });

  if (!category) {
    throw new HttpError(404, 'Category not found');
  }

  // Отримати всі ID категорій, які потрібно оновити
  const categoryIds = await getAllCategoryIds(id);
  categoryIds.push(id); // Додаємо саму кореневу категорію

  // Оновити margin для всіх категорій одним запитом
  await ASGCategory.updateMany(
    { id: { $in: categoryIds } },
    { $set: { margin } },
  );

  // Отримати всі оновлені категорії
  const updatedCategories = await ASGCategory.find({
    id: { $in: categoryIds },
  });

  console.log('Updated categories from DB:', updatedCategories);

  // Побудувати дерево категорій
  const categoryTree = buildCategoryTree(updatedCategories);

  console.log('Category tree:', JSON.stringify(categoryTree, null, 2));

  // Відправити відповідь
  res.json({
    status: 'success',
    code: 200,
    data: categoryTree,
  });
};

module.exports = updCmsCategoryMargin;
