const { ctrlWrap } = require('../../decorators');

const addClient = require('./addClient');
const fetchClients = require('./fetchClients');
const fetchShipmentsByClient = require('./fetchShipmentsByClient');
const addShipment = require('./addShipment');
const updShipment = require('./updShipment');
const fetchOneClient = require('./fetchOneClient');
const deleteShipment = require('./deleteShipment');
const searchClients = require('./searchClients');

module.exports = {
  addClient: ctrlWrap(addClient),
  fetchClients: ctrlWrap(fetchClients),
  fetchShipmentsByClient: ctrlWrap(fetchShipmentsByClient),
  addShipment: ctrlWrap(addShipment),
  updShipment: ctrlWrap(updShipment),
  fetchOneClient: ctrlWrap(fetchOneClient),
  deleteShipment: ctrlWrap(deleteShipment),
  searchClients: ctrlWrap(searchClients),
};
