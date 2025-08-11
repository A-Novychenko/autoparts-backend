const axios = require('axios');

// const getBearer = async () => {};

const X_ASG_HEADER = process.env.X_ASG_HEADER;
const ASG_URL = process.env.ASG_URL;

console.log('ASG_URL', ASG_URL);

const serviceASG = axios.create({
  // baseURL: 'https://online.asg.ua/api',
  baseURL: ASG_URL,
  headers: {
    'X-Asg-Header': X_ASG_HEADER,
  },
});

// serviceASG.defaults.headers.common.Authorization = `Bearer ${data.access_token}`;
// serviceASG.defaults.headers.common.Authorization = getBearer();

module.exports = serviceASG;
