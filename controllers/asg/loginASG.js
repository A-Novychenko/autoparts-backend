const { serviceASG } = require('../../helpers');

const { ASG_LOGIN, ASG_PASSWORD } = process.env;

const loginASG = async (req, res) => {
  const credentials = { login: ASG_LOGIN, password: ASG_PASSWORD };

  const { data } = await serviceASG.post('/auth/login', credentials);

  serviceASG.defaults.headers.common.Authorization = `Bearer ${data.access_token}`;

  res.json({
    status: 'OK',
    code: 200,
    data,
  });
};

module.exports = loginASG;
