const express = require("express");
const apiRouter = express.Router();
const userApi = require('./user/userRouter');
const collectiveRouter = require('./collective/collectiveRouter');
const choreRouter = require('./chore/choreRouter');
const overdueRouter =  require('./overdue/overdueRouter');

apiRouter.use('/user', userApi);
apiRouter.use('/collective', collectiveRouter);
apiRouter.use('/chore', choreRouter);
apiRouter.use('/overdue', overdueRouter);

module.exports = apiRouter;