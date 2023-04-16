const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const { getMe, editUserInfo } = require('../controllers/users');

router.get('/me', getMe);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    name: Joi.string().min(2).max(30),
  }),
}), editUserInfo);

module.exports = router;
