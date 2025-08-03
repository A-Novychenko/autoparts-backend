const express = require('express');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const cron = require('node-cron');
require('dotenv').config();
const {
  createErrorReq,
  generateSitemapFunc,
  cronUpdPriceAndStockAsg,
} = require('./helpers');

const { PORT = 3005, DB_HOST, SERVER_MODE } = process.env;

const authRouter = require('./routes/api/auth');
const asgRouter = require('./routes/api/asg');
const ordersRouter = require('./routes/api/orders');
const catalogRouter = require('./routes/api/catalog');
const cmsCatalogRouter = require('./routes/api/cmsCatalog');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

if (SERVER_MODE === 'prod') {
  cron.schedule('40 5,13,20 * * *', cronUpdPriceAndStockAsg, {
    timezone: 'Europe/Kyiv',
  });
}

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/asg', asgRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/catalog', catalogRouter);
app.use('/api/cms-catalog', cmsCatalogRouter);
app.use('/sitemaps', express.static(path.join(__dirname, 'public/sitemaps')));

app.use((_, res, __) => {
  res.status(404).json({
    status: 'error',
    code: 404,
    message: 'not the correct route',
    data: 'Not found',
  });
});

app.use((err, req, res, next) => {
  const { status = 500, message = 'Server error' } = err;
  const { statusText, codeErr, messageDescr, dataDescr } = createErrorReq(
    status,
    message,
  );

  res.status(status).json({
    status: statusText,
    code: codeErr,
    message: messageDescr,
    data: dataDescr,
  });
});

mongoose
  .connect(DB_HOST)
  // .then(app.listen(PORT))
  .then(async () => {
    app.listen(PORT, () => {
      if (process.env.SERVER_MODE !== 'dev') {
        console.log(`✅ Server running. PORT: ${PORT}`);
      }
    });

    if (process.env.SERVER_MODE !== 'dev') {
      // ✅ Генерація sitemap одразу після запуску
      try {
        const count = await generateSitemapFunc();
        console.log(`✅ Sitemaps згенеровані. Файлів: ${count}`);
      } catch (error) {
        console.error('❌ Помилка генерації sitemap:', error);
      }
    }
  })
  .catch(e => {
    console.log(`Server not running. Error message: ${e.message}`);
    process.exit(1);
  });
