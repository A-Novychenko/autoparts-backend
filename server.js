const express = require('express');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();

const { PORT } = process.env;
const authRouter = require('./routes/api/auth');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);

app.use((_, res) => {
  res.status(404).json({ message: 'Not Found' });
});

app.use((e, _, res, __) => {
  const { status, message } = e;

  res.status(status).json(message);
});

app.listen(PORT, () => {
  console.log(`Server successfully run on port ${PORT}`);
});
