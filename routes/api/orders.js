const express = require('express');

const { authenticate, isAdmin, isValidId } = require('../../middlewares');
const {
  getAllVinRequests,
  addVinRequest,
  getOneVinRequest,
} = require('../../controllers/orders');
const { validateBody } = require('../../decorators');
const { schemasVinRequest } = require('../../models/orders/vin-request');

const router = express.Router();

router.get('/vin-requests', getAllVinRequests);
router.get('/vin-requests/:id', isValidId, getOneVinRequest);

router.post(
  '/add-vin-request',
  validateBody(schemasVinRequest.addVinRequestSchema),
  addVinRequest,
);

module.exports = router;
