const axios = require('axios');

const { TG_TOKEN, TG_METHOD, TG_URL, TG_CHAT_ID } = process.env;

const sendTg = async msg => {
  const telegramAPI = axios.create();

  //   const TG_BASE_URL = `https://api.telegram.org/bot${TOKEN}`;

  const BASE_URL = `${TG_URL}${TG_TOKEN}/${TG_METHOD}`;

  const result = await telegramAPI.post(BASE_URL, {
    chat_id: TG_CHAT_ID,
    parse_mode: 'html',
    text: msg,
  });

  return result;
};

module.exports = sendTg;
