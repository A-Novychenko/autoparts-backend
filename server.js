const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const { createErrorReq } = require('./helpers');

const { PORT = 3005, DB_HOST } = process.env;
const authRouter = require('./routes/api/auth');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);

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
  .then(app.listen(PORT))
  .catch(e => {
    console.log(`Server not running. Error message: ${e.message}`);
    process.exit(1);
  });
