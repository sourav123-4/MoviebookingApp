module.exports = (mongoose)=>{
  const Genre = mongoose.model("genre", new mongoose.Schema({
    genreid : {type : Number, required : true},
    genre : {type : String, required : true}
  }, 
  {timestamps : true}
  ));
  return Genre;
};