const express = require('express');

const { authenticate, isAdmin, isValidId } = require('../../middlewares');
const {
  getAllVinRequests,
  addVinRequest,
  getOneVinRequest,
  updateVinRequests,
  addOrder,
  getAllOrders,
  getOneOrder,
  getOrderStatus,
  updateOrder,
  addCallback,
  getAllCallback,
  updateCallback,
} = require('../../controllers/orders');
const { validateBody } = require('../../decorators');
const { schemasVinRequest } = require('../../models/orders/vin-request');
const { schemasOrder } = require('../../models/orders/order');
const { schemasCallback } = require('../../models/orders/callback');

const router = express.Router();

router.get('/', getAllOrders);
router.post('/add-order', validateBody(schemasOrder.addOrderSchema), addOrder);

router.get('/vin-requests', getAllVinRequests);
router.post(
  '/add-vin-request',
  validateBody(schemasVinRequest.addVinRequestSchema),
  addVinRequest,
);

router.get('/callback', getAllCallback);
router.post(
  '/add-callback',
  validateBody(schemasCallback.addCallbackSchema),
  addCallback,
);

router.get('/:id', isValidId, getOneOrder);
router.get('/status/:id', isValidId, getOrderStatus);
router.patch(
  '/:id',
  authenticate,
  isValidId,
  validateBody(schemasOrder.updateOrderSchema),
  updateOrder,
);

router.get('/vin-requests/:id', isValidId, getOneVinRequest);
router.patch(
  '/vin-requests/:id',
  isValidId,
  // validateBody(),
  updateVinRequests,
);

router.patch(
  '/callback/:id',
  authenticate,
  isValidId,
  validateBody(schemasCallback.updateCallbackSchema),
  updateCallback,
);

module.exports = router;
