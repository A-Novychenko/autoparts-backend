const express = require('express');

const { authenticate, isValidId, recaptcha } = require('../../middlewares');
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

router.get('/', authenticate, getAllOrders);
router.post(
  '/add-order',
  recaptcha,
  validateBody(schemasOrder.addOrderSchema),
  addOrder,
);

router.get('/vin-requests', authenticate, getAllVinRequests);
router.post(
  '/add-vin-request',
  recaptcha,
  validateBody(schemasVinRequest.addVinRequestSchema),
  addVinRequest,
);

router.get('/callback', authenticate, getAllCallback);
router.post(
  '/add-callback',
  recaptcha,
  validateBody(schemasCallback.addCallbackSchema),
  addCallback,
);

router.get('/:id', authenticate, isValidId, getOneOrder);
router.get('/status/:id', isValidId, getOrderStatus);
router.patch(
  '/:id',
  authenticate,
  isValidId,
  validateBody(schemasOrder.updateOrderSchema),
  updateOrder,
);

router.get('/vin-requests/:id', authenticate, isValidId, getOneVinRequest);
router.patch(
  '/vin-requests/:id',
  authenticate,
  isValidId,
  validateBody(schemasVinRequest.updateVinRequestSchema),
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
