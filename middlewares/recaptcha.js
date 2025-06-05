const { serviceCaptcha, HttpError } = require('../helpers');

const recaptcha = async (req, res, next) => {
  const { captchaToken } = req.body;

  try {
    const { data } = await serviceCaptcha(captchaToken);

    // if (data.success) {
    if (!data.success) {
      //Сообщение если и коректировать то здесь и компоненте "Cart" на основном сайте в хендлсабмит
      next(HttpError(400, 'Captcha verification failed'));
    }

    next();
  } catch (e) {
    console.log('e', e);
  }
};

module.exports = recaptcha;
