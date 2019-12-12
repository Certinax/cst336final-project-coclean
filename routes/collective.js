const express = require("express");
const router = express.Router();

router.get("/", function(req, res) {
  if (req.session.userId) {
    res.render("page/collective/select", {
      collective: true,
      title: "Collective"
    });
  } else {
    res.redirect("/");
  }
});

router.get("/new", function(req, res) {
  res.render("page/collective/new", {
    collective: true,
    title: "Create Collective"
  });
});

router.get("/edit", function(req, res) {
  res.render("page/collective/edit", {
    collective: true,
    title: "Edit Collective"
  });
});

module.exports = router;
