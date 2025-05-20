const express = require('express');

const { authenticate, isAdmin, isValidId } = require('../../middlewares');
const {
  getAllVinRequests,
  addVinRequest,
  getOneVinRequest,
  updateVinRequests,
  addOrder,
} = require('../../controllers/orders');
const { validateBody } = require('../../decorators');
const { schemasVinRequest } = require('../../models/orders/vin-request');
const { schemasOrder } = require('../../models/orders/order');

const router = express.Router();

router.get('/vin-requests', getAllVinRequests);
router.get('/vin-requests/:id', isValidId, getOneVinRequest);

router.post(
  '/add-vin-request',
  validateBody(schemasVinRequest.addVinRequestSchema),
  addVinRequest,
);

router.patch(
  '/vin-requests/:id',
  authenticate,
  isAdmin,
  isValidId,
  // validateBody(),
  updateVinRequests,
);

router.post('/add-order', validateBody(schemasOrder.addOrderSchema), addOrder);

module.exports = router;
