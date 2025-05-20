const { ctrlWrap } = require('../../decorators');

const getAllVinRequests = require('./getAllVinRequests');
const addVinRequest = require('./addVinRequest');
const getOneVinRequest = require('./getOneVinRequest');
const updateVinRequests = require('./updateVinRequests');
const addOrder = require('./addOrder');

module.exports = {
  getAllVinRequests: ctrlWrap(getAllVinRequests),
  addVinRequest: ctrlWrap(addVinRequest),
  getOneVinRequest: ctrlWrap(getOneVinRequest),
  updateVinRequests: ctrlWrap(updateVinRequests),
  addOrder: ctrlWrap(addOrder),
};
