const express = require('express');

const {
  login,
  getCurrentUser,
  getAllUsers,
  changeStatus,
  logout,
  register,
  removeUser,
} = require('../../controllers/auth');
const { validateBody } = require('../../decorators');
const { schemas } = require('../../models/user');
const { authenticate, isValidId } = require('../../middlewares');

const router = express.Router();

router.post(
  '/register',
  authenticate,
  validateBody(schemas.registerSchema),
  register,
);

router.post('/login', validateBody(schemas.loginSchema), login);

router.get('/user', authenticate, getAllUsers);

router.patch(
  '/status',
  authenticate,
  validateBody(schemas.changeStatus),
  changeStatus,
);

router.get('/current', authenticate, getCurrentUser);

router.post('/logout', authenticate, logout);

router.delete('/user/:id', authenticate, isValidId, removeUser);

module.exports = router;
