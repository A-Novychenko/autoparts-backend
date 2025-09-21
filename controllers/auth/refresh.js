const jwt = require('jsonwebtoken');
const { HttpError } = require('../../helpers');
const { User } = require('../../models/user');

const { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } = process.env;

const refresh = async (req, res) => {
  const { refreshToken: oldRefreshToken } = req.body;

  try {
    const { id } = jwt.verify(oldRefreshToken, REFRESH_SECRET_KEY);

    const isExist = await User.findOne({ refreshToken: oldRefreshToken });

    if (!isExist) {
      throw HttpError(403, 'Token invalid');
    }

    const accessToken = jwt.sign({ id }, ACCESS_SECRET_KEY, {
      expiresIn: '2m',
    });
    const refreshToken = jwt.sign({ id }, REFRESH_SECRET_KEY, {
      expiresIn: '7d',
    });

    await User.findByIdAndUpdate(id, { accessToken, refreshToken });

    res.json({ accessToken, refreshToken });
  } catch (e) {
    throw HttpError(403, e.message);
  }
};

module.exports = refresh;
