const db = require("../models/");

const Genre = db.genres;

const findAllGenres = async (req, res)=>{
  try {
    const genres = await Genre.find({});
    res.status(200).json({genres});
  } catch (err) {
    res.sendStatus(404);
  }
}

module.exports = {findAllGenres};