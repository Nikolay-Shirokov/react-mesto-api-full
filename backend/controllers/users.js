const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const ERROR_MESSAGE = {
  notValid: 'Переданы некорректные данные.',
  notFound: 'Пользователь по указанному _id не найден.',
};

const { SALT_ROUNDS, JWT_SECRET } = require('../middlewares/secrets');

const { handleError, checkDataFound, ConflictError } = require('../utils/errors');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );

      const hour = 3600000;
      const week = hour * 24 * 7;

      res
        .cookie('jwt', token, {
          maxAge: week,
          httpOnly: true,
        })
        .send({ 'token': token });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь по указанному email уже зарегистрирован'));
      }
      handleError(err, next, ERROR_MESSAGE);
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => handleError(err, next, ERROR_MESSAGE));
};

module.exports.getUserByID = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      checkDataFound(user, ERROR_MESSAGE.notFound);
      res.send(user);
    })
    .catch((err) => handleError(err, next, ERROR_MESSAGE));
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      checkDataFound(user, ERROR_MESSAGE.notFound);
      res.send(user);
    })
    .catch((err) => handleError(err, next, ERROR_MESSAGE));
};

module.exports.updateUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, about, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, about, avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      checkDataFound(user, ERROR_MESSAGE.notFound);
      res.send(user);
    })
    .catch((err) => handleError(err, next, ERROR_MESSAGE));
};

module.exports.updateUserAvatar = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      checkDataFound(user, ERROR_MESSAGE.notFound);
      res.send(user);
    })
    .catch((err) => handleError(err, next, ERROR_MESSAGE));
};
