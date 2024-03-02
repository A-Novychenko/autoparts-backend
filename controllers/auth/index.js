const { ctrlWrap } = require('../../decorators');

const register = require('./register');
const login = require('./login');
const getUser = require('./getUser');
const getAllUsers = require('./getAllUsers');
const changeStatus = require('./changeStatus');
const logout = require('./logout');
const removeUser = require('./removeUser');

module.exports = {
  register: ctrlWrap(register),
  login: ctrlWrap(login),
  getUser: ctrlWrap(getUser),
  getAllUsers: ctrlWrap(getAllUsers),
  changeStatus: ctrlWrap(changeStatus),
  logout: ctrlWrap(logout),
  removeUser: ctrlWrap(removeUser),
};
