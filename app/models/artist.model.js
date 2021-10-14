module.exports=(mongoose)=>{

  const ArtistSchema = new mongoose.Schema({
    artistsid : {type : Number, required : true},
    first_name : {type : String, required : true},
    last_name : {type : String, required : true},
    wiki_url : {type : String, required : true},
    profile_url : {type : String, required : true},
    movies : {type : [], required : true}
  }, 
  {timestamps : true}
  );
  const Artist = mongoose.model("artist", ArtistSchema);
  return Artist;
};