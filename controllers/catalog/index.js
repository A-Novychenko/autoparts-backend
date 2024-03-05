const { ctrlWrap } = require('../../decorators');
const getParentCategory = require('./getParentCategory');

module.exports = {
  getParentCategory: ctrlWrap(getParentCategory),
};
