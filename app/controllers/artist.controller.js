const db = require("../models/");

// artists collection
const Artist = db.artists;

const findAllArtists = async (req, res)=>{
  try {
    const artists = await Artist.find({});
    res.status(200).json({artists});
  } catch (err) {
    res.sendStatus(404);
  }
}

module.exports={findAllArtists};