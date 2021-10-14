const db = require(`../models/`);
const token =  require('uuid-token-generator');
const {uuid} =  require('uuidv4');

const User = db.users;

let refNo = 23000;

// function for signing up
const signUp = async (req, res)=>{
  const {email_address, password} = req.body;
  try {
    if(email_address && password){
      const userEmail = await User.findOne({"email" : email_address});
      // if user had already been registered
      if(userEmail) {
        res.status(400).json({message : "User already exists"});
        return;
      }
      try{
        // registering the user
        const newUserId = await User.find({}).count() + 1;
        const {first_name, last_name, mobile_number, role} = req.body;
        const newUser = new User({
          userid : newUserId,
          email : email_address,
          first_name,
          last_name,
          username : `${first_name}${last_name}`,
          contact : mobile_number,
          password,
          role : role? role : "user",
          isLoggedIn : false,
          uuid : "",
          accesstoken : ""
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
      } catch(err){
        console.log(err);
        res.status(500).json({message : "Some error occured, please try again"});
        return;
      }
    } else{
      res.status(400).json({message : "Email / Password not entered"});
    }
  } catch (error) {
    res.status(500).json({message : "Some error occured, please try again"});
  }
}

// function for logging in
const login = async (req, res)=>{
  try{
    const b2a = require('b2a');
    const header = req.header("Authorization").split(" ")[1];
    // decoding the credentials from the header
    const credentials = b2a.atob(header);
    const [username, password] = credentials.split(":");
    // if either username or password field is left blank
    if(!username || !password){
      res.status(400).json({message : "Please enter your username / password"});
      return;
    }
    const userInDB = await User.findOne({username});
    if(userInDB){
      if(password === userInDB.password){
        // if user is already logged in
        if(userInDB.isLoggedIn){
          res.status(400).send("You are already logged in");
          return;
        }
        try {
          const tokenObj = new token();
          // generating access token
          const accesstoken = tokenObj.generate();
          // generating uuid for the user
          const id = uuid();
          // updating the login status of the user
          const updatedUserDetails = await User.findOneAndUpdate(
            {username}, 
            {
              isLoggedIn : true,
              uuid : id,
              accesstoken
            },
            {new : true}
          );
          res.status(200).json({id, "access-token" : accesstoken}); 
        } catch (err) {
          console.log(err);
          res.status(500).json({message : "Some error has occured, please try again"});
        }
      } else{
        console.log("Invalid password");
        res.status(401).json({message : "Invalid username / password"});
      }
    } else{
      res.status(400).send("Please sign up");
    }
  }catch(err){
    console.log(err);
    res.status(500).send("Some error has occured, please try again");
  }
}

// function for logging out
const logout = async (req, res)=>{
  try {
    const {uuid : uuidUser} = req.body;
    // checking if the user had logged in before or not
    if(uuidUser){
      try {
        // updating the login status of the user
        const user = await User.findOneAndUpdate(
          {uuid :uuidUser},
          {
            isLoggedIn : false,
            uuid : "",
            accesstoken : ""
          },
          {new : true});
        console.log("logged out");
        res.status(200).json({message : "Logged Out successfully."});
        return;
      } catch (err) {
        res.status(401).json({message : "User not found"});
      }
    } else{
      console.log("id not provided");
      res.status(400).json({message : "Please provide credentials to log out"});
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({message : "Some error occured, please try again"});
  }
}

// function to book shows
const bookShow = async (req, res)=>{
  try {
    const {customerUuid, bookingRequest} = req.body;
    // if user is not logged in 
    if(!customerUuid){
      res.status(402).json({message : "User not logged in"});
      return;
    }
    // if booking request is not specified
    if(!bookingRequest){
      res.status(400).json({message : "Empty request"});
      return;
    }
    const {coupon_code, show_id, tickets} = bookingRequest;
    // finding the specific user
    const user = await User.findOne({uuid : customerUuid});
    // converting the code array into a valid datatype according the schema created
    const parsedCoupon_code = parseInt(coupon_code);
    const parsedTickets = tickets[0].trim().split(",").map(item=>parseInt(item.trim()));
    if(user){
      try {
        // creating a new booking request
        const updatedUser = await User.findOneAndUpdate({uuid : customerUuid}, {"$push" : {"bookingRequests" : {
          "reference_number" : refNo++, 
          coupon_code : parsedCoupon_code,
          show_id,
          tickets : parsedTickets
        }}}, {"new" : true});
        console.log(updatedUser);
        res.status(201).json({reference_number : updatedUser.bookingRequests[updatedUser.bookingRequests.length - 1].reference_number});
        return;
      } catch (err) {
        console.log(err);
        res.status(400).json({message : "Invalid details"});
      }
    } else{
      res.status(401).json({message : "User not found"});
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({message : "Some error occured, please try again"});
  }
}

// function to get the discount value based on the coupon
const getCouponCode = async (req, res) =>{
  // if user is logged in
  if(!req.header("Authorization")){
    res.status(400).json({message : "Invalid user"});
    return;
  }
  const couponCode = parseInt(req.query.code, 10);
  if(couponCode === NaN){
    res.status(404).json({message : "Invalid coupon code"});
    return;
  }
  const accesstoken = req.header("Authorization").split("Bearer ")[1];
  if(couponCode){
    try{
      // finding the coupon code
      const user = await User.findOne({accesstoken});
      const coupon = user.coupens.filter(item=>item.id === couponCode)[0];
      if(!coupon){
        res.status(404).json({message : "Coupon not available"});
        return;
      }
      res.status(200).json({discountValue : coupon.discountValue});
    } catch(err){
      console.log(err);
      res.status(401).json({message : "User invalid"});
    }
  } else{
    res.status(400).json({message : "Missing coupon code"});
  }
}

module.exports = {signUp, login, logout, bookShow, getCouponCode};