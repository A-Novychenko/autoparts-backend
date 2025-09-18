const express = require('express');

const { authenticate, isValidId } = require('../../middlewares');
const {
  addClient,
  fetchClients,
  fetchShipmentsByClient,
  addShipment,
  updShipment,
  fetchOneClient,
  deleteShipment,
} = require('../../controllers/clients');
const { validateBody } = require('../../decorators');
const { schemasShipment } = require('../../models/clients/shipments');

const router = express.Router();

router.post('/new', authenticate, addClient);

router.get('/', authenticate, fetchClients);

router.get('/shipment/:id', authenticate, isValidId, fetchShipmentsByClient);

router.post(
  '/add-shipment/:id',
  authenticate,
  isValidId,
  validateBody(schemasShipment.addShipmentSchema),
  addShipment,
);

router.patch(
  '/shipment/:id',
  authenticate,
  isValidId,
  validateBody(schemasShipment.updShipmentSchema),
  updShipment,
);

router.delete('/shipment/:id', authenticate, isValidId, deleteShipment);

router.get('/one-client/:id', authenticate, isValidId, fetchOneClient);

module.exports = router;
