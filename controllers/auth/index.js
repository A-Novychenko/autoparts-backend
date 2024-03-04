const { ctrlWrap } = require('../../decorators');

const register = require('./register');
const login = require('./login');
const getCurrentUser = require('./getCurrentUser');
const getAllUsers = require('./getAllUsers');
const changeStatus = require('./changeStatus');
const logout = require('./logout');
const removeUser = require('./removeUser');

module.exports = {
  register: ctrlWrap(register),
  login: ctrlWrap(login),
  getCurrentUser: ctrlWrap(getCurrentUser),
  getAllUsers: ctrlWrap(getAllUsers),
  changeStatus: ctrlWrap(changeStatus),
  logout: ctrlWrap(logout),
  removeUser: ctrlWrap(removeUser),
};
