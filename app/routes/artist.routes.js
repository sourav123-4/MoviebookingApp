const artists = require('../controllers/artist.controller');

const main = (app)=>{
  const router = require('express').Router();
  app.use("/api", router);
  router.get('/artists', artists.findAllArtists);
}

module.exports = main;