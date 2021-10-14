module.exports=(mongoose)=>{

  const ArtistSchema = new mongoose.Schema({
    artistsid : {type : Number, required : true},
    first_name : {type : String, required : true},
    last_name : {type : String, required : true},
    wiki_url : {type : String, required : true},
    profile_url : {type : String, required : true},
    movies : {type : [mongoose.Schema.Types.ObjectId], required : true}
  });

  const Show = new mongoose.Schema({
    id : {type : Number, required : true},
    theatre : {type : {
      name : {
        type : String,
        required : true
      },
      city : {
        type : String,
        required : true
      }
    }, required : true},
    language : {type : String, required : true},
    show_timing : {type : String, required : true},
    available_seats : {type : String, required : true},
    unit_price : {type : Number, required : true},
  });

  const Movie = mongoose.model("movie", new mongoose.Schema({
    movieid : {type : Number, required : true},
    title : {type : String, required : true},
    published : {type : Boolean, required : true},
    released : {type : Boolean, required : true},
    poster_url : {type : String, required : true},
    release_date : {type : String, required : true},
    publish_date : {type : String, required : true},
    artists : {type : [ArtistSchema], required : true},
    genres : {type : [String], required : true},
    duration : {type : Number, required : true},
    critic_rating : {type : Number, required : true},
    trailer_url : {type : String, required : true},
    wiki_url : {type : String, required : true},
    story_line : {type : String, required : true},
    shows : {type : [Show], required : true}
  }, 
  {timestamps : true}
  ));
  return Movie;
};