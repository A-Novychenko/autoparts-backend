const express = require('express');

const { getParentCategory } = require('../../controllers/catalog');

const router = express.Router();

router.get('/', getParentCategory);

module.exports = router;
