const axios = require('axios');

// const getBearer = async () => {};

const serviceASG = axios.create({
  baseURL: 'https://online.asg.ua/api',
});

// serviceASG.defaults.headers.common.Authorization = `Bearer ${data.access_token}`;
// serviceASG.defaults.headers.common.Authorization = getBearer();

module.exports = serviceASG;
