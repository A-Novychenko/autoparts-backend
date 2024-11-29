const isAdmin = async (req, res, next) => {
  const { role } = req.user;

  if (role !== 'admin') {
    next(HttpError(401, 'Available only to the administrator'));
  }

  next();
};

module.exports = isAdmin;
