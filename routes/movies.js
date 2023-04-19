const router = require('express').Router();
const { moviesPost, moviesDelete } = require('../middlewares/validation');

const {
  getMovies,
  postMovies,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', moviesPost, postMovies);

router.delete('/:id', moviesDelete, deleteMovie);

module.exports = router;
