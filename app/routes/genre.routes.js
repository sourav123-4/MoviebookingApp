const genres = require('../controllers/genre.controller');

const main = (app)=>{
  const router = require('express').Router();
  app.use("/api", router);
  router.get('/genres', genres.findAllGenres);
}

module.exports = main;