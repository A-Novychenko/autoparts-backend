const { ctrlWrap } = require('../../decorators');

const getAllVinRequests = require('./getAllVinRequests');
const addVinRequest = require('./addVinRequest');
const getOneVinRequest = require('./getOneVinRequest');

module.exports = {
  getAllVinRequests: ctrlWrap(getAllVinRequests),
  addVinRequest: ctrlWrap(addVinRequest),
  getOneVinRequest: ctrlWrap(getOneVinRequest),
};
