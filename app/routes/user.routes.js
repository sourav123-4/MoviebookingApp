const users = require("../controllers/user.controller");

const main = app =>{
  const router = require('express').Router();
  app.use('/api/auth', router);
  router.post('/signup', users.signUp); //api for user signup
  router.post(`/login`, users.login); //api for user login
  router.post('/logout', users.logout); //api for user logout
  router.post('/bookings', users.bookShow); //api for booking shows
  router.get('/coupons', users.getCouponCode); //api for getting the discount value based on the coupon code
}

module.exports = main;