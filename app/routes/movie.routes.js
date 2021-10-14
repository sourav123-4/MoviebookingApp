const movies = require("../controllers/movie.controller");

const main = app =>{
  const router = require("express").Router();
  app.use("/api", router);
  router.get('/movies', movies.findAllMovies);
  router.get('/movies/:movieId', movies.findOne);
}

module.exports = main;