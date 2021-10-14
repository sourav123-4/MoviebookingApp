const movies = require("../controllers/movie.controller");

const main = app =>{
  const router = require("express").Router();
  app.use("/api", router);
  router.get('/movies', movies.findAllMovies); //api to get all movies
  router.get('/movies/:movieId', movies.findOne); //api to get a specific movie based on the movie id
}

module.exports = main;