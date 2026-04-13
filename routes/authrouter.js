const express = require('express');
const authRouter = express.Router();
const authcontroller = require('../controllers/authcontroller')
authRouter.get('/login',authcontroller.getLogin);
authRouter.post('/login',authcontroller.postLogin);
authRouter.post('/logout',authcontroller.postLogout);
authRouter.get('/signup',authcontroller.getSignup);
authRouter.post('/signup',authcontroller.postSignup);
console .log("auth router loaded");
module.exports = authRouter;