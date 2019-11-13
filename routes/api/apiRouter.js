const MySQL = require('../../res/class/mysql/MySQL');
const User = require('../../res/class/orm/User');
const express = require("express");
const apiRouter = express.Router();
const userApi = require('./user/userRouter');

apiRouter.use('/user', userApi);

module.exports = apiRouter;