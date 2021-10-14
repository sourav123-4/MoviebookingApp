const db = require("../models/");
const Movie = db.movies;

const findAllMovies= async(req, res)=>{
  try{
    console.log(req.query)
    const {status, title, genres, artists, start_date, end_date} = req.query; 
    let movies = await Movie.find();
    if(status){
      console.log("checking by status")
      movies = await findByStatus(status, res);
    }
    if(title){
      console.log("checking by title");
      movies = findByTitle(title, movies);
    }
    if(genres){
      console.log("checking by genres")
      movies = findByGenres(genres, movies);
    }
    if(artists){
      console.log("checking by artists")
      movies = findByArtists(artists, movies);
    }
    if(start_date){
      console.log("checking by startdate")
      movies = findByStartDate(start_date, movies);
    }
    if(end_date){
      console.log("checking by enddate")
      movies = findByEndDate(end_date, movies);
    }
    res.status(200).json({movies});
  } catch(err){
    console.log(err);
    res.sendStatus(404);
  }
}

const findByStatus= async(status, res)=>{
    if(status === 'PUBLISHED'){
      let data =  await Movie.find({"published" : true});
      return data;
    } else if(status === 'RELEASED'){
      let data =  await Movie.find({"released" : true});
      return data;
    } else{
      throw Error({code : 400, message : "Bad Request"});
    }
}

const findByTitle = (title, movies)=>{
  return movies.filter((item)=>item.title===title);
}

const findByGenres = (genres, movies)=>{
  console.log("simple genres", genres);
  let genreArr = genres.split(",");
  console.log("GenreArr : ", genreArr);
  return movies.filter((item)=>item.genres.some(genre=>genreArr.includes(genre)));
}

const findByArtists = (artists, movies)=>{
  console.log("simple artist", artists);
  let artistArr = artists.split(",");
  console.log("ArtistArr : ", artistArr);
  return movies.filter((item)=>item.artists.some(artist=>artistArr.includes(artist)));
}

const findByStartDate = (startDate, movies)=>{
  return movies.filter(item=>item.startDate === startDate);
}

const findByEndDate = (endDate, movies)=>{
  return movies.filter(item=>item.endDate === endDate);
}

const findOne = async(req, res)=>{
  try{
    const {movieId} = req.params;
    const id = parseInt(movieId, 10);
    if(id !== NaN){
      const movie = await Movie.find({"movieid" : id});
      if(movie){
        res.status(200).json(movie);
      } else{
        res.sendStatus(404);
      }
    } else{
      res.sendStatus(422);
    }
  } catch(err){
    res.sendStatus(404);
  }
}

const findShows = async (req, res) =>{
  try{
    const {movieid} = req.params;
    const id = parseInt(movieid, 10);
    if(id !== NaN){
      const shows = await Movie.find({"movieid" : id}).shows;
      if(shows.length > 0){
        res.status(200).json(shows);
      } else{
        res.sendStatus(404);
      }
    } else{
      res.sendStatus(422);
    }
  } catch(err){
    res.sendStatus(404);
  }
}


module.exports = {findAllMovies, findOne, findShows};
