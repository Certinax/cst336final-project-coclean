const express = require("express");
const router = express.Router();

router.get("/", function(req, res) {
  res.render("page/collective/landingpage-no-collective", {
    collective: true,
    title: "Collective"
  });
});

router.get("/new", function(req, res) {
  res.render("page/collective/new-collective", {
    collective: true,
    title: "Create Collective"
  });
});

module.exports = router;
