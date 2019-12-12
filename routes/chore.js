const express = require("express");
const router = express.Router();

router.get("/", function(req, res) {
  if (req.session.userId) {
    res.render("page/chore/home", {
      title: "Chores",
      username: req.session.username
    });
  } else {
    res.redirect("/");
  }
});

module.exports = router;
