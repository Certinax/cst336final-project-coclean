const express = require("express");
const router = express.Router();
const apiRouter = require("./api/apiRouter");
const testRouter = require("./test/test");

// Landing page.
router.get("/", function(req, res, next) {
  res.render("index", {
    title: "CoClean",
    link: "ToBe Added",
    //username: req.session.username,
    message: "We are overqualified."
  });
});

// * API Router.
router.use("/api", apiRouter);

// ! TEST ROUTER FOR API
// TODO: Delete when obsolete.
router.use("/test", testRouter);

module.exports = router;
