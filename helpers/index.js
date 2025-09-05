const HttpError = require('./HttpError');
const handleMongooseError = require('./handleMongooseError');
const userRegexp = require('./userRegexp');
const createErrorReq = require('./createErrorReq');
const serviceASG = require('./serviceASG');
const sendTg = require('./sendTg');
const sendEmail = require('./sendEmail');
const serviceCaptcha = require('./serviceCaptcha');
const transformedProductsByCMS = require('./transformedProductsByCMS');
const transformedProductsBySite = require('./transformedProductsBySite');
const formatDateToUkrainian = require('./formatDateToUkrainian');
const generateSlugName = require('./generateSlugName');
const generateProductPath = require('./generateProductPath');
const generateSitemapFunc = require('./generateSitemapFunc');
const asgUpdStockAndPriceFunc = require('./asgUpdStockAndPriceFunc');
const cronUpdPriceAndStockAsg = require('./cronUpdPriceAndStockAsg');
const normalizePhoneToLogin = require('./normalizePhoneToLogin');

module.exports = {
  HttpError,
  handleMongooseError,
  userRegexp,
  createErrorReq,
  serviceASG,
  sendTg,
  sendEmail,
  serviceCaptcha,
  transformedProductsByCMS,
  transformedProductsBySite,
  formatDateToUkrainian,
  generateSlugName,
  generateProductPath,
  generateSitemapFunc,
  asgUpdStockAndPriceFunc,
  cronUpdPriceAndStockAsg,
  normalizePhoneToLogin,
};
