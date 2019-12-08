const express = require("express");
const router = express.Router();

router.get("/", function(req, res) {
  res.render("page/collective/landingpage-no-collective", {
    collective: true,
    title: "Collective"
  });
});

module.exports = router;
