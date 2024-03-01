const ctrlWrap = ctrl => {
  const wrapper = async (req, res, next) => {
    try {
      await ctrl(res, req);
    } catch (e) {
      next(e);
    }
  };

  return wrapper;
};

module.exports = ctrlWrap;
