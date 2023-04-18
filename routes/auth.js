const router = require('express').Router();

const { authSignUpValidation, authSignInValidation } = require('../middlewares/validation');

const {
  signIn, signUp,
} = require('../controllers/users');

router.post('/signup', authSignUpValidation, signUp);

router.post('/signin', authSignInValidation, signIn);

module.exports = router;
