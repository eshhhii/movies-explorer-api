const router = require("express").Router();
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require("../controllers/movies");
const {
  validationMovieId,
  validationCreateMovie,
} = require("../middlewares/validation");

router.get("/movies", getMovies);
router.post("/movies", validationCreateMovie, createMovie);
router.delete("/movies/:movieId", validationMovieId, deleteMovie);

module.exports = router;
