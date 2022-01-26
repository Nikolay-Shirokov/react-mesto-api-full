const router = require('express').Router();
const {
  getUsers, getUserByID, updateUser, updateUserAvatar, getCurrentUser,
} = require('../controllers/users');
const { validateUserData, validateAvatarData, validateId } = require('../middlewares/validation');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:id', validateId, getUserByID);
router.patch('/me', validateUserData, updateUser);
router.patch('/me/avatar', validateAvatarData, updateUserAvatar);

module.exports = router;
