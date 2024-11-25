const { serviceASG, HttpError } = require('./');

const { ASG_LOGIN, ASG_PASSWORD } = process.env;

const fetchImgs = async productsIds => {
  console.log('ASG-connect IMG');
  try {
    // const { data } = await serviceASG.post('/product-images', productsIds);
    const { data } = await serviceASG.post('/product-images', {
      product_ids: productsIds,
    });

    return data;
  } catch (e) {
    if (e.response.status !== 401) return;

    console.log('first');

    const credentials = { login: ASG_LOGIN, password: ASG_PASSWORD };
    try {
      const resASG = await serviceASG.post('/auth/login', credentials);
      serviceASG.defaults.headers.common.Authorization = `Bearer ${resASG.data.access_token}`;

      const { data } = await serviceASG.post('/product-images', productsIds);
      return data;
    } catch (e) {
      throw HttpError(500);
    }
  }
};

module.exports = fetchImgs;
