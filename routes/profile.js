const express = require("express");
const router = express.Router();

router.get("/", function(req, res) {
  if (req.session.userId) {
    res.render("profile", {
      profile: true,
      title: "User Profile",
      username: req.session.username
    });
  } else {
    res.redirect("/");
  }
});

module.exports = router;
