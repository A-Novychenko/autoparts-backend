const authenticate = require('./authenticate');
const isValidId = require('./isValidId');
const isAdmin = require('./isAdmin');
const recaptcha = require('./recaptcha');
const uploadCloud = require('./uploadCloud');

module.exports = { authenticate, isValidId, isAdmin, recaptcha, uploadCloud };
