const { asgUpdStockAndPriceFunc } = require('../../helpers');

const DBUpdStockAndPriceASGAllProducts = async (req, res) => {
  try {
    const failedPages = await asgUpdStockAndPriceFunc();

    if (failedPages.length > 0) {
      res.status(207).json({
        status: 'partial',
        code: 207,
        message: 'Обновление завершено частично',
        updatedCount: updated,
        failedPages,
      });
    } else {
      console.log('✅ Обновление завершено успешно.');
      res.json({
        status: 'success',
        code: 200,
        message: 'Все товары обновлены',
        updatedCount: updated,
      });
    }
  } catch (e) {
    console.error('🔥 Критическая ошибка:', e.message);
    res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Не удалось завершить обновление',
    });
  }
};

module.exports = DBUpdStockAndPriceASGAllProducts;
