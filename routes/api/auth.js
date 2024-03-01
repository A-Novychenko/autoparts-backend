const express = require('express');
const { login, getUser, logout } = require('../../controllers/auth');
// const { validateBody } = require('../../decorators');

const router = express.Router();

router.post('/login', login);

router.get('/user/:id', getUser);

router.post('/logout', logout);

module.exports = router;
