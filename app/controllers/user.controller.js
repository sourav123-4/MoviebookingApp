const db = require(`../models/`);
const token =  require('uuid-token-generator');
const {uuid} =  require('uuidv4');

const User = db.users;

let refNo = 23000;

const signUp = async (req, res)=>{
  const {email_address, password} = req.body;
  console.log(email_address);
  console.log(password);
  try {
    if(email_address && password){
      const userEmail = await User.findOne({"email" : email_address});
      console.log("in db", userEmail);
      if(userEmail) {
        res.status(400).json({message : "User already exists"});
        return;
      }
      try{
        console.log("in action");
        const newUserId = await User.find({}).count() + 1;
        console.log("new user id", newUserId);
        const {first_name, last_name, mobile_number, role} = req.body;
        console.log("going to save");
        const newUser = new User({
          userid : newUserId,
          email : email_address,
          first_name,
          last_name,
          username : `${first_name} ${last_name}`,
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

const login = async (req, res)=>{
  try{
    const b2a = require('b2a');
    const header = req.header("Authorization").split(" ")[1];
    console.log(header)
    const credentials = b2a.atob(header);
    const [username, password] = credentials.split(":");
    console.log(credentials);
    console.log(username);
    console.log(password);
    if(!username || !password){
      res.status(400).json({message : "Please enter your username / password"});
      return;
    }
    const userInDB = await User.findOne({username});
    if(userInDB){
      if(password === userInDB.password){
        console.log("Password verified");
        if(userInDB.isLoggedIn){
          res.status(400).send("You are already logged in");
          return;
        }
        try {
          console.log("going to login");
          const tokenObj = new token();
          const accesstoken = tokenObj.generate();
          const id = uuid();
          console.log("accesstoken" , accesstoken);
          console.log("uuid", id);
          const updatedUserDetails = await User.findOneAndUpdate(
            {username}, 
            {
              isLoggedIn : true,
              uuid : id,
              accesstoken
            },
            {new : true}
          );
          console.log("You have logged in succesfully");
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

const logout = async (req, res)=>{
  try {
    const {uuid : uuidUser} = req.body;
    console.log(uuidUser);
    if(uuidUser){
      try {
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

const bookShow = async (req, res)=>{
  try {
    const {customerUuid, bookingRequest} = req.body;
    if(!bookingRequest){
      res.status(400).json({message : "Empty request"});
      return;
    }
    const {coupon_code, show_id, tickets} = bookingRequest;
    console.log("booking request ",bookingRequest)
    const user = await User.findOne({uuid : customerUuid});
    const parsedCoupon_code = parseInt(coupon_code);
    const parsedTickets = tickets[0].trim().split(",").map(item=>parseInt(item.trim()));
    if(user){
      try {
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

const getCouponCode = async (req, res) =>{
  console.log("req.query : ", req.query);
  console.log("req.header : ", req.header("Authorization"));
  if(!req.header("Authorization")){
    res.status(400).json({message : "Invalid user"});
    return;
  }
  const couponCode = parseInt(req.query.code, 10);
  if(couponCode === NaN){
    res.status(404).json({message : "Invalid coupon code"});
    return;
  }
  console.log("coupon code ", couponCode);
  const accesstoken = req.get("Authorization").split("Bearer ")[1];
  console.log("accesstoken ", accesstoken);
  if(couponCode){
    try{
      const user = await User.findOne({accesstoken});
      console.log("user is ", user);
      const coupon = user.coupens.filter(item=>item.id === couponCode)[0];
      console.log("coupons : ", coupon);
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