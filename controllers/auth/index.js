const { ctrlWrap } = require('../../decorators');

const login = require('./login');
const getUser = require('./getUser');
const logout = require('./logout');

module.exports = {
  login: ctrlWrap(login),
  getUser: ctrlWrap(getUser),
  logout: ctrlWrap(logout),
};
