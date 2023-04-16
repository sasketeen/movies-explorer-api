const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { mongoose } = require('mongoose');
const User = require('../models/user');

const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const ConflictingRequest = require('../errors/ConflictingRequest');

const { JWT_SECRET } = require('../appConfig');

module.exports.signUp = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => {
      const newUser = user.toObject();
      delete newUser.password;
      res.status(201).send(newUser);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequest('Переданы некорректные данные при создании пользователя'));
      } else
      if (err.code === 11000) {
        next(new ConflictingRequest('Такой пользователь уже существует'));
      } else {
        next(err);
      }
    });
};

module.exports.signIn = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '1d' });
      res.send({ token });
    })
    .catch(next);
};

module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        next(new NotFound('Пользователь не найден'));
      }
    })
    .catch((err) => next(err));
};

module.exports.editUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail(new NotFound('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError
      || err instanceof mongoose.Error.CastError) {
        next(new BadRequest('Переданы некорректные данные при обновлении профиля'));
      } else
      if (err.code === 11000) {
        next(new ConflictingRequest('Этот email уже занят'));
      } else {
        next(err);
      }
    });
};
