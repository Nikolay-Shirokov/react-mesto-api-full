const ERROR_CODE = {
  notValid: 400,
  notAuth: 401,
  forbidden: 403,
  notFound: 404,
  conflict: 409,
  default: 500,
};

const ERROR_MESSAGE = {
  notValid: 'Переданы некорректные данные.',
  default: 'Произошла ошибка на сервере',
};

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = ERROR_CODE.notValid;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFound';
    this.statusCode = ERROR_CODE.notFound;
  }
}

class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = ERROR_CODE.notAuth;
  }
}
class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = ERROR_CODE.forbidden;
  }
}
class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = ERROR_CODE.conflict;
  }
}
class DefaultError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Default';
    this.statusCode = ERROR_CODE.default;
  }
}

function handleError(err, next, errorMessage = {}) {
  if (!err.statusCode) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return next(new ValidationError(errorMessage.notValid || ERROR_MESSAGE.notValid));
    }
    return next(new DefaultError(err.message || ERROR_MESSAGE.default));
  }
  return next(err);
}

function centralErrorHandler(err, req, res, next) {
  res
    .status(err.statusCode || ERROR_CODE.default)
    .send({ message: err.message || ERROR_MESSAGE.default });

  next();
}

function checkDataFound(data, message) {
  if (!data) {
    throw new NotFoundError(message);
  }
}

module.exports = {
  ValidationError,
  NotFoundError,
  DefaultError,
  AuthError,
  ConflictError,
  ForbiddenError,
  handleError,
  centralErrorHandler,
  checkDataFound,
};
