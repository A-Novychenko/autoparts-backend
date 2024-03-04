const ctrlWrap = ctrl => {
  const wrapper = async (req, res, next) => {
    try {
      await ctrl(req, res, next);
    } catch (e) {
      console.log('error.status ');
      next(e);
    }
  };

  return wrapper;
};

module.exports = ctrlWrap;
