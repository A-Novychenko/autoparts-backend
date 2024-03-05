const axios = require('axios');

const serviceASG = axios.create({
  baseURL: 'https://online.asg.ua/api',
});

module.exports = serviceASG;
