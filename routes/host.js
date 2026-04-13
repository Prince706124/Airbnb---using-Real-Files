const express = require('express');

const path = require('path');
const homescontroller = require('../controllers/host-controller')
const hostRouter = express.Router();
const rootDir = require('../utils/path');
hostRouter.get('/add-home',homescontroller.getaddhome);
hostRouter.post('/submitted',homescontroller.postaddhome);
hostRouter.get('/host-homelist',homescontroller.gethosthomelist);
hostRouter.get('/edit-home/:homeId',homescontroller.getEditHome);
hostRouter.post('/edit-home',homescontroller.postedithome);
hostRouter.post('/delete-home/:homeId',homescontroller.postdeletehome);
exports.hostRouter = hostRouter;