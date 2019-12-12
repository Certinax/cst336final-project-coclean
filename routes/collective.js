const express = require("express");
const router = express.Router();
const axios = require("axios");
const url = require("url");

router.get("/", function(req, res) {
  if (req.session.userId && req.session.isInCollective) {
    res.render("page/collective/home", {
      collective: true,
      title: "Collective",
      username: req.session.username
    });
  } else if (req.session.userId && !req.session.isInCollective) {
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
  if (req.session.userId && !req.session.isInCollective) {
    res.render("page/collective/new", {
      collective: true,
      title: "Create Collective",
      username: req.session.username
    });
  } else if (req.session.userId && req.session.isInCollective) {
    res.redirect("/collective");
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

router.post("/create", function(req, res) {
  if (req.session.userId) {
    console.log(req.body);
    const requrl = url.format({
      protocol: req.protocol,
      host: req.get("host")
      // pathname: req.originalUrl
    });

    const apiURL = `${requrl}/api/collective`;
    const { name, description, school } = req.body;
    axios
      .post(apiURL, {
        name: name,
        description: description,
        school: school,
        userId: req.session.userId
      })
      .then(function(result) {
        if (result.data.meta.success) {
          req.session.isInCollective = true;
        }
        res.json(result.data.meta);
      })
      .catch(function(error) {
        console.log(error);
      });
  } else {
    res.redirect("/");
  }
});

module.exports = router;
