const router = require('express').Router();
const { userEditMe } = require('../middlewares/validation');
const { getMe, editUserInfo } = require('../controllers/users');

router.get('/me', getMe);
router.patch('/me', userEditMe, editUserInfo);

module.exports = router;
