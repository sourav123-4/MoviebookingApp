const users = require("../controllers/user.controller");

const main = app =>{
  const router = require('express').Router();
  app.use('/api/auth', router);
  router.post('/signup', users.signUp);
  router.post(`/login`, users.login);
  router.post('/logout', users.logout);
  router.post('/bookings', users.bookShow);
  router.get('/coupons', users.getCouponCode);
}

module.exports = main;