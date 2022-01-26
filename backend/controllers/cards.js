const Card = require('../models/card');

const ERROR_MESSAGE = {
  notValid: 'Переданы некорректные данные.',
  notFound: 'Карточка с указанным _id не найдена.',
};

const { handleError, checkDataFound, ForbiddenError } = require('../utils/errors');

module.exports.createCard = (req, res, next) => {
  const cardData = req.body;
  cardData.owner = req.user;

  Card.create(cardData)
    .then((card) => Card.findById(card._id))
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch((err) => handleError(err, next, ERROR_MESSAGE));
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => handleError(err, next, ERROR_MESSAGE));
};

module.exports.deleteCardByID = (req, res, next) => {
  const cardId = req.params.id;

  Card.findById(cardId)
    .then((card) => {
      checkDataFound(card, ERROR_MESSAGE.notFound);
      if (card.owner._id.toString() !== req.user._id) {
        throw new ForbiddenError('Запрещено удалять чужие карточки');
      }
      return Card.findByIdAndRemove(cardId)
        .populate(['owner', 'likes']);
    })
    .then((card) => {
      checkDataFound(card, ERROR_MESSAGE.notFound);
      res.send(card);
    })
    .catch((err) => handleError(err, next, ERROR_MESSAGE));
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      checkDataFound(card, ERROR_MESSAGE.notFound);
      res.send(card);
    })
    .catch((err) => handleError(err, next, ERROR_MESSAGE));
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      checkDataFound(card, ERROR_MESSAGE.notFound);
      res.send(card);
    })
    .catch((err) => handleError(err, next, ERROR_MESSAGE));
};
