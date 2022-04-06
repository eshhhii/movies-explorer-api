const Movie = require("../models/movie");
const BadRequest = require("../errors/BadRequest");
const NotFound = require("../errors/NotFound");
const Forbidden = require("../errors/Forbidden");

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.status(200).send(movies))
    .catch((err) => next(err));
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(BadRequest("Переданы некорректные данные"));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  const userId = req.user._id;
  const { movieId } = req.params;
  Movie.findById(movieId).then((movie) => {
    if (!movie) {
      throw new NotFound("Фильм не найден");
    }
    if (userId !== String(movie.owner)) {
      throw new Forbidden("Недостаточно прав");
    }
    Movie.findOneAndRemove(movieId)
      .then((currentMovie) => {
        if (!currentMovie) {
          throw new NotFound("Фильм не найден");
        }
        return res.status(200).send("Успешно");
      })
      .catch((err) => {
        if (err.name === "CastError") {
          throw new BadRequest(
            "Переданы некорректные данные в методы удалении"
          );
        } else {
          next(err);
        }
      });
  });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
