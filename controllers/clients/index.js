const { ctrlWrap } = require('../../decorators');

const addClient = require('./addClient');
const fetchClients = require('./fetchClients');
const fetchShipmentsByClient = require('./fetchShipmentsByClient');

module.exports = {
  addClient: ctrlWrap(addClient),
  fetchClients: ctrlWrap(fetchClients),
  fetchShipmentsByClient: ctrlWrap(fetchShipmentsByClient),
};
