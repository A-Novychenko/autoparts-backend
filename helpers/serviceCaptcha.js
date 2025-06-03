const axios = require('axios');

const BASE_URL = process.env.GOOGLE_RECAPTCHA_URL;
const SECRET = process.env.GOOGLE_RECAPTCHA_SECRET;

const serviceCaptcha = async token => {
  const serviceCaptchaApi = axios.create();

  const params = new URLSearchParams();
  params.append('secret', SECRET);
  params.append('response', token);

  return await serviceCaptchaApi.post(BASE_URL, params.toString(), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

module.exports = serviceCaptcha;
