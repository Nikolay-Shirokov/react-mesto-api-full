const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./secrets');
const { AuthError } = require('../utils/errors');

const ERROR_MESSAGE = {
  authError: 'Необходима авторизация',
};

module.exports = (req, res, next) => {
  if (!req.cookies || !req.cookies.jwt) {
    return next(new AuthError(ERROR_MESSAGE.authError));
  }

  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new AuthError(ERROR_MESSAGE.authError));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
