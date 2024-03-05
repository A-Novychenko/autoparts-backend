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
const { authenticate, isValidId, isAdmin } = require('../../middlewares');

const router = express.Router();

router.post('/login', validateBody(schemas.loginSchema), login);

router.get('/current', authenticate, getCurrentUser);

router.post('/logout', authenticate, logout);

router.post(
  '/register',
  authenticate,
  isAdmin,
  validateBody(schemas.registerSchema),
  register,
);

router.get('/user', authenticate, isAdmin, getAllUsers);

router.patch(
  '/status',
  authenticate,
  isAdmin,
  validateBody(schemas.changeStatus),
  changeStatus,
);

router.delete('/user/:id', authenticate, isAdmin, isValidId, removeUser);

module.exports = router;
