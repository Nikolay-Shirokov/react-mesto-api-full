const router = require('express').Router();
const {
  createCard, getCards, deleteCardByID, likeCard, dislikeCard,
} = require('../controllers/cards');
const { validateNewCardData, validateId } = require('../middlewares/validation');

router.post('/', validateNewCardData, createCard);
router.get('/', getCards);
router.delete('/:id', validateId, deleteCardByID);
router.put('/:id/likes', validateId, likeCard);
router.delete('/:id/likes', validateId, dislikeCard);

module.exports = router;
