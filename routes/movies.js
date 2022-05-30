const router = require("express").Router();
const {
  validationMovie,
  validationMovieID,
} = require("../middlewares/validation");
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require("../controllers/movies");

router.get("/movies", getMovies);
router.post("/movies", validationMovie, createMovie);
router.delete("/movies/:movieId", validationMovieID, deleteMovie);

module.exports = router;
