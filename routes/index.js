const express = require("express");
const router = express.Router();
const apiRouter = require("./api/apiRouter");
const testRouter = require("./test/test");
const profileRouter = require("./profile");
const collectiveRouter = require("./collective");
const choreRouter = require("./chore");
const signupRouter = require("./signup");
const loginRouter = require("./auth/login");
const logoutRouter = require("./auth/logout");
const searchRouter = require("./search");
const statisticsRouter = require("./statistics");
const url = require("url");

// Landing page.
router.get("/", function(req, res, next) {
  if (req.session.userId) {
    res.render("index", {
      home: true,
      title: "CoClean",
      message: "We are overqualified.",
      username: req.session.username
    });
  } else {
    res.render("index", {
      home: true,
      title: "CoClean"
    });
  }
});

// * API Router.
router.use("/api", apiRouter);

// ! TEST ROUTER FOR API
// TODO: Delete when obsolete.
router.use("/test", testRouter);

router.use("/profile", profileRouter);
router.use("/collective", collectiveRouter);
router.use("/chore", choreRouter);
router.use("/signup", signupRouter);
router.use("/login", loginRouter);
router.use("/logout", logoutRouter);
router.use("/search", searchRouter);
router.use("/statistics", statisticsRouter);
module.exports = router;
