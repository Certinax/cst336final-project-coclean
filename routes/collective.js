const express = require("express");
const router = express.Router();

router.get("/", function(req, res) {
  if (req.session.userId) {
    res.render("page/collective/select", {
      collective: true,
      title: "Collective",
      username: req.session.username
    });
  } else {
    res.redirect("/");
  }
});

router.get("/new", function(req, res) {
  if (req.session.userId) {
    res.render("page/collective/new", {
      collective: true,
      title: "Create Collective",
      username: req.session.username
    });
  } else {
    res.redirect("/");
  }
});

router.get("/edit", function(req, res) {
  if (req.session.userId) {
    res.render("page/collective/edit", {
      collective: true,
      title: "Edit Collective",
      username: req.session.username
    });
  } else {
    res.redirect("/");
  }
});

module.exports = router;
