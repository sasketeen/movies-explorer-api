const router = require('express').Router();

const authRouter = require('./auth');
const userRouter = require('./users');
// const cardRouter = require('./cards');
const auth = require('../middlewares/auth');
const NotFound = require('../errors/NotFound');

router.use('/', authRouter);
router.use(auth);
router.use('/users', userRouter);
router.use('/*', (req, res, next) => {
  next(new NotFound('Как ты тут оказался?'));
});

module.exports = router;
