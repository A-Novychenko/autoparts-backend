const { ctrlWrap } = require('../../decorators');

const getAllVinRequests = require('./getAllVinRequests');
const addVinRequest = require('./addVinRequest');
const getOneVinRequest = require('./getOneVinRequest');
const updateVinRequests = require('./updateVinRequests');
const addOrder = require('./addOrder');
const getAllOrders = require('./getAllOrders');
const getOneOrder = require('./getOneOrder');

module.exports = {
  getAllVinRequests: ctrlWrap(getAllVinRequests),
  addVinRequest: ctrlWrap(addVinRequest),
  getOneVinRequest: ctrlWrap(getOneVinRequest),
  updateVinRequests: ctrlWrap(updateVinRequests),
  addOrder: ctrlWrap(addOrder),
  getAllOrders: ctrlWrap(getAllOrders),
  getOneOrder: ctrlWrap(getOneOrder),
};
