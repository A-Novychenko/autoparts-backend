const { DateTime } = require('luxon');

const asgUpdStockAndPriceFunc = require('../helpers/asgUpdStockAndPriceFunc');
const generateSitemapFunc = require('./generateSitemapFunc');

const sendEmail = require('../helpers/sendEmail');

const { ADMIN_EMAIL } = process.env;

const createReportEmail = stats => {
  const {
    startTime,
    endTime,
    duration,
    stockStatus,
    sitemapStatus,
    globalError,
  } = stats;

  const isGlobalSuccess =
    !globalError &&
    stockStatus.success &&
    (sitemapStatus ? sitemapStatus.success : false);
  const subjectIcon = isGlobalSuccess ? '✅' : '⚠️';
  const headerColor = isGlobalSuccess ? '#28a745' : '#dc3545';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
      <div style="background-color: ${headerColor}; color: white; padding: 20px; text-align: center;">
        <h2 style="margin: 0;">${isGlobalSuccess ? 'Глобальное обновление завершено' : 'Ошибка при обновлении'}</h2>
        <p style="margin: 5px 0 0;">${startTime}</p>
      </div>
      
      <div style="padding: 20px;">
        <h3 style="border-bottom: 2px solid #eee; padding-bottom: 10px;">⏱ Хронология</h3>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Начало:</strong> ${startTime}</li>
          <li><strong>Конец:</strong> ${endTime}</li>
          <li><strong>Длительность:</strong> ${duration} мин.</li>
        </ul>

        <h3 style="border-bottom: 2px solid #eee; padding-bottom: 10px; margin-top: 20px;">📦 1. Обновление Товаров (ASG)</h3>
        ${
          stockStatus.success
            ? '<p style="color: green;">✔ Успешно выполнено</p>'
            : `<p style="color: red;">❌ Ошибка: ${stockStatus.error}</p>`
        }
        
        ${
          stockStatus.failedQty > 0
            ? `<p style="background-color: #fff3cd; padding: 10px; border-radius: 4px;">⚠ <strong>Не обновлено товаров:</strong> ${stockStatus.failedQty}</p>`
            : '<p style="color: #6c757d; font-size: 0.9em;">Все товары обновлены корректно.</p>'
        }

        <h3 style="border-bottom: 2px solid #eee; padding-bottom: 10px; margin-top: 20px;">🗺 2. Генерация Sitemap</h3>
        ${
          !sitemapStatus
            ? '<p style="color: #6c757d;">⏭ Пропущено из-за ошибки на предыдущем шаге</p>'
            : sitemapStatus.success
              ? `<p style="color: green;">✔ Успешно. Файлов создано: <strong>${sitemapStatus.count}</strong></p>`
              : `<p style="color: red;">❌ Ошибка генерации: ${sitemapStatus.error}</p>`
        }

        ${globalError ? `<div style="margin-top: 30px; padding: 15px; background-color: #f8d7da; color: #721c24; border-radius: 5px;"><strong>🔥 Критическая ошибка процесса:</strong><br/>${globalError}</div>` : ''}
      </div>
      
      <div style="background-color: #f8f9fa; padding: 10px; text-align: center; font-size: 12px; color: #6c757d;">
        Автоматическое уведомление сервера
      </div>
    </div>
  `;

  return {
    to: ADMIN_EMAIL,
    subject: `${subjectIcon} Report: Обновление товаров и Sitemap (${startTime})`,
    html,
  };
};

const cronUpdPriceAndStockAsg = async () => {
  const startObj = DateTime.now().setZone('Europe/Kyiv');
  const startTime = startObj.toFormat('dd.MM.yyyy HH:mm:ss');

  console.log(
    `🚀 [GLOBAL UPD] Запуск обновления товаров и sitemap: ${startTime}`,
  );

  const stats = {
    startTime,
    endTime: null,
    duration: 0,
    stockStatus: { success: false, error: null, failedQty: 0 },
    sitemapStatus: null, // null означает, что шаг не запускался
    globalError: null,
  };

  try {
    // --- ШАГ 1: Обновление остатков ---
    console.log('⏳ [1/2] Обновление цен и наличия...');
    try {
      const { failedPages } = await asgUpdStockAndPriceFunc();
      stats.stockStatus.success = true;
      stats.stockStatus.failedQty = failedPages ? failedPages.length : 0;
      console.log(
        `✅ [1/2] Готово. Проблемных товаров: ${stats.stockStatus.failedQty}`,
      );
    } catch (e) {
      stats.stockStatus.error = e.message;
      throw new Error(`Ошибка на этапе обновления базы: ${e.message}`);
    }

    // --- ШАГ 2: Sitemap (Только если Шаг 1 успешен) ---
    console.log('⏳ [2/2] Генерация Sitemap...');
    try {
      const count = await generateSitemapFunc();
      stats.sitemapStatus = { success: true, count: count, error: null };
      console.log(`✅ [2/2] Готово. Файлов: ${count}`);
    } catch (e) {
      stats.sitemapStatus = { success: false, count: 0, error: e.message };
      // Не выбрасываем ошибку, чтобы отправить отчет о частичном успехе
      console.error('❌ [2/2] Ошибка генерации Sitemap:', e.message);
    }
  } catch (e) {
    console.error('🔥 CRITICAL FAIL:', e.message);
    stats.globalError = e.message;
  } finally {
    // --- Финализация и отправка отчета ---
    const endObj = DateTime.now().setZone('Europe/Kyiv');
    stats.endTime = endObj.toFormat('dd.MM.yyyy HH:mm:ss');
    stats.duration = endObj
      .diff(startObj, 'minutes')
      .toObject()
      .minutes.toFixed(1);

    await sendEmail(createReportEmail(stats));
    console.log(`🏁 [GLOBAL UPDATE] Завершено за ${stats.duration} мин.`);
  }
};

module.exports = cronUpdPriceAndStockAsg;
