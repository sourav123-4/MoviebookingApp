let validator = require('validator')

module.exports = (mongoose)=>{
  const Coupen = new mongoose.Schema({
    id : {type : Number, required : true},
    discountValue : {type : Number, required : true}
  });

  const BookingRequest = new mongoose.Schema({
    reference_number : {type : Number, required: true},
    coupon_code : {type : Number},
    show_id : {type : Number, required: true},
    tickets : {type : [Number], required: true}
  });

  const User = mongoose.model("user", new mongoose.Schema({
    userid : {type : Number, required : true},
    email : {type : String, required : true, validate : (value)=>validator.isEmail(value)},
    first_name : {type : String, required : true},
    last_name : {type : String, required : true},
    username : {type : String, required : true},
    contact : {type : String, required : true},
    password : {type : String, required : true},
    role : {type : String, required : true, default : "user"},
    isLoggedIn : {type : Boolean, required : true},
    uuid : {type : String},
    accesstoken : {type : String},
    coupens : {type : [Coupen]},
    bookingRequests : {type : [BookingRequest]},
  }));
  return User;
}