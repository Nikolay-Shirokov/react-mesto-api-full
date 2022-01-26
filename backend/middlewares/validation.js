const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const isCorrectUrl = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new Error('URL validation err');
};

// Валидация запросов манипулирования данными пользователей

const avatarField = {
  avatar: Joi.string().custom(isCorrectUrl),
};

const userDataFields = {
  name: Joi.string().min(2).max(30),
  about: Joi.string().min(2).max(30),
  ...avatarField,
};

const userAuthFields = {
  email: Joi.string().required().email(),
  password: Joi.string().required(),
};

const validateAuthData = celebrate({
  body: Joi.object().keys({
    ...userAuthFields,
  }),
});

const validateNewUserData = celebrate({
  body: Joi.object().keys({
    ...userDataFields,
    ...userAuthFields,
  }),
});

const validateUserData = celebrate({
  body: Joi.object().keys(userDataFields),
});

const validateAvatarData = celebrate({
  body: Joi.object().keys(avatarField),
});

// Валидация запросов манипулирования данными карточек
const validateNewCardData = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().custom(isCorrectUrl),
  }),
});

// Общие
const validateId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
});

module.exports = {
  validateId,
  validateAuthData,
  validateNewUserData,
  validateUserData,
  validateAvatarData,
  validateNewCardData,
};
