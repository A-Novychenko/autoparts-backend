const { ctrlWrap } = require('../../decorators');

const getAllVinRequests = require('./getAllVinRequests');
const addVinRequest = require('./addVinRequest');
const getOneVinRequest = require('./getOneVinRequest');
const updateVinRequests = require('./updateVinRequests');
const addOrder = require('./addOrder');
const getAllOrders = require('./getAllOrders');
const getOneOrder = require('./getOneOrder');
const getOrderStatus = require('./getOrderStatus');
const updateOrder = require('./updateOrder');
const addCallback = require('./addCallback');
const getAllCallback = require('./getAllCallback');
const updateCallback = require('./updateCallback');

module.exports = {
  getAllVinRequests: ctrlWrap(getAllVinRequests),
  addVinRequest: ctrlWrap(addVinRequest),
  getOneVinRequest: ctrlWrap(getOneVinRequest),
  updateVinRequests: ctrlWrap(updateVinRequests),
  addOrder: ctrlWrap(addOrder),
  getAllOrders: ctrlWrap(getAllOrders),
  getOneOrder: ctrlWrap(getOneOrder),
  getOrderStatus: ctrlWrap(getOrderStatus),
  updateOrder: ctrlWrap(updateOrder),
  addCallback: ctrlWrap(addCallback),
  getAllCallback: ctrlWrap(getAllCallback),
  updateCallback: ctrlWrap(updateCallback),
};
