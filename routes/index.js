const express = require("express");
const router = express.Router();
const apiRouter = require("./api/apiRouter");
const testRouter = require("./test/test");
const profileRouter = require("./profile");
const collectiveRouter = require("./collective");
const choreRouter = require("./chore");
const signupRouter = require("./signup");
const url = require("url");

// Landing page.
router.get("/", function(req, res, next) {
  res.render("index", {
    title: "CoClean",
    link: "ToBe Added",
    //username: req.session.username,
    message: "We are overqualified.",
    home: true
  });
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
module.exports = router;
