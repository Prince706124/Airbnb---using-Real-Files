const express = require('express');
const path = require('path');
const userRouter = express.Router();
const homecontroller = require('../controllers/store-controller')
const rootDir = require('../utils/path');
const { registeredHomes } = require('./host');
userRouter.get('/',homecontroller.gethome);
userRouter.get('/bookings',homecontroller.getBooking);
userRouter.get('/favourite-list',homecontroller.getfavourite);
userRouter.post('/favourite-list',homecontroller.postfavourite);
userRouter.get('/home-list',homecontroller.gethomelist);
userRouter.get('/homes/:homeID',homecontroller.gethomedetails);
userRouter.post('/favourites/delete/:homeId',homecontroller.deleteFavourite)
module.exports = (userRouter);