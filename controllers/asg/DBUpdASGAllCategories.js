const { ASGCategory } = require('../../models/asg/categories');

const { serviceASG } = require('../../helpers');

const ASG_LOGIN = process.env.ASG_LOGIN;
const ASG_PASSWORD = process.env.ASG_PASSWORD;

const fetchCategoriesWithRetry = async () => {
  try {
    const { data } = await serviceASG.post('/categories');
    return data.data; // Повертає масив об'єктів
  } catch (e) {
    if (e.response?.status === 401) {
      console.log('Refreshing token...');
      const credentials = { login: ASG_LOGIN, password: ASG_PASSWORD };
      const resASG = await serviceASG.post('/auth/login', credentials);
      serviceASG.defaults.headers.common.Authorization = `Bearer ${resASG.data.access_token}`;
      const { data } = await serviceASG.post('/categories');
      return data.data;
    } else {
      console.error('Error fetching categories:', e.message);
      throw new Error('Failed to fetch categories');
    }
  }
};

const DBUpdASGAllCategories = async (req, res) => {
  try {
    // Отримуємо дані категорій із повторною авторизацією у разі помилки
    const newCategories = await fetchCategoriesWithRetry();

    // Отримуємо всі поточні категорії з бази даних
    const existingCategories = await ASGCategory.find({}, { id: 1 });

    // Формуємо списки ID для порівняння
    const newCategoryIds = newCategories.map(category => category.id);
    const existingCategoryIds = existingCategories.map(category => category.id);

    // Визначаємо, які категорії потрібно видалити
    const categoriesToDelete = existingCategoryIds.filter(
      id => !newCategoryIds.includes(id),
    );

    // Видаляємо застарілі категорії
    if (categoriesToDelete.length > 0) {
      await ASGCategory.deleteMany({ id: { $in: categoriesToDelete } });
    }

    // Оновлюємо або додаємо нові категорії
    const bulkOperations = newCategories.map(category => ({
      updateOne: {
        filter: { id: category.id },
        update: { $set: category },
        upsert: true, // Додає новий документ, якщо його немає
      },
    }));

    if (bulkOperations.length > 0) {
      await ASGCategory.bulkWrite(bulkOperations);
    }

    res.json({
      status: 'OK',
      code: 200,
      message: 'Категорії оновлено успішно',
    });
  } catch (error) {
    console.error('Error updating categories:', error);
    res.status(500).json({
      status: 'ERROR',
      code: 500,
      message: 'Помилка при оновленні категорій',
    });
  }
};

module.exports = DBUpdASGAllCategories;
