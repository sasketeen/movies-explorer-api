const { mongoose } = require('mongoose');
const Movie = require('../models/movie');

const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const Forbidden = require('../errors/Forbidden');

module.exports.getMovies = (req, res, next) => {
  const { _id } = req.user;
  Movie.find({ owner: _id })
    .populate('owner')
    .then((movies) => {
      if (movies.length !== 0) {
        res.send(movies);
        return;
      }
      next(new NotFound('Фильмы не найдены'));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.postMovies = (req, res, next) => {
  const { _id } = req.user;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: _id,
  })
    .then((movie) => {
      movie.populate('owner')
        .then(() => res.status(201).send(movie))
        .catch(next);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError
        || err instanceof mongoose.Error.CastError) {
        next(new BadRequest('Переданы некорректные данные при добавлении фильма'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const movieId = req.params.id;
  Movie.findById(movieId)
    .orFail(new NotFound('Фильм не найден'))
    .then((movie) => {
      if (req.user._id !== movie.owner._id.toString()) {
        next(new Forbidden('Доступ запрещен'));
        return;
      }
      Movie
        .findByIdAndRemove(movieId)
        .then(() => res.send(movie))
        .catch((err) => next(err));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) next(new BadRequest('Неверные параметры запроса'));
      next(err);
    });
};
