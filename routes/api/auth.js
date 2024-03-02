const express = require('express');
const {
  login,
  getUser,
  getAllUsers,
  changeStatus,
  logout,
  register,
  removeUser,
} = require('../../controllers/auth');
const { validateBody } = require('../../decorators');
const { schemas } = require('../../models/user');

const router = express.Router();

router.post('/register', validateBody(schemas.registerSchema), register);

router.post('/login', login);

router.get('/user', getAllUsers);

router.patch('/status', changeStatus);

router.get('/current', getUser);

router.post('/logout', logout);

router.delete('/user/:id', removeUser);

module.exports = router;
