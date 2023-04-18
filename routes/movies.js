const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { urlRegExp } = require('../utils/isURL');

const {
  getMovies,
  postMovies,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().pattern(urlRegExp).required(),
    trailerLink: Joi.string().pattern(urlRegExp).required(),
    thumbnail: Joi.string().pattern(urlRegExp).required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), postMovies);

router.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
}), deleteMovie);

module.exports = router;
