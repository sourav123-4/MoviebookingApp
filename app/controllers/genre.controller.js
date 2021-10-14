const db = require("../models/");

// genres collection
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