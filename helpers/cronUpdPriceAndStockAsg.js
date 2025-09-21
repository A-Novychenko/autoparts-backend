const { DateTime } = require('luxon');

const asgUpdStockAndPriceFunc = require('./asgUpdStockAndPriceFunc');
const sendEmail = require('./sendEmail');

const { ADMIN_EMAIL } = process.env;

const makeMailTransaction = (date, status, qty) => {
  return {
    to: ADMIN_EMAIL,
    subject: `Обновление товаров. Дата:${date} - ${status ? 'Успешно' : `Есть не обновленные страницы - ${qty}`}`,
    html: `<p>Обновление товаров. Дата:${date} - ${status ? 'Успешно' : `Есть не обновленные страницы - ${qty}`}</p>`,
  };
};

const errorMailTransaction = {
  to: ADMIN_EMAIL,
  subject: 'ОШИБКА - Обновление товаров.',
  html: '<p>ОШИБКА - Обновление товаров.</p>',
};

const cronUpdPriceAndStockAsg = async () => {
  const date = DateTime.now()
    .setZone('Europe/Kyiv')
    .toFormat('yyyy-MM-dd HH:mm:ss');

  console.log('⏰ Запуск обновления остатков', date);

  try {
    const { failedPages } = await asgUpdStockAndPriceFunc();

    const isSuccess = !failedPages.length > 0;
    const failedQty = failedPages.length;

    await sendEmail(makeMailTransaction(date, isSuccess, failedQty));

    console.error(
      `✅ ОБНОВЛЕНЫ ${isSuccess ? 'Успешно' : `Не обновлено ${failedQty} товаров`}`,
    );
  } catch (e) {
    console.error('🔥 Критическая ошибка:', e.message);
    await sendEmail(errorMailTransaction);
  }
};

module.exports = cronUpdPriceAndStockAsg;
