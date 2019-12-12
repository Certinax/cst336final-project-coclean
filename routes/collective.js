const express = require("express");
const router = express.Router();
const axios = require('axios');

router.get("/", function(req, res) {

  if (req.session.userId && req.session.isInCollective) {
    const url = `${req.headers.referer}api/user/${req.session.userId}/collective`;
    axios.get(url).then((resolved) => {
      res.render("page/collective/home", {
        collective: true,
        title: "Collective",
        username: req.session.username,
        userId: req.session.userId,
        collectiveId: resolved.data['result'][0]['ID'],
        invitationKey: resolved.data['result'][0]['key']
      });
    }).catch((error) => {
      console.log(error);
      res.status(500);
      res.send('<h1>[500] Something went wrong</h1>');
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

router.post('/leave', (req, res, next) => {
  let {userId, collectiveId} = req.body;
  userId = 15; collectiveId = 20;
  const URL = req.headers.referer + `api/user/${userId}/leave`;
  axios.post(URL, {collectiveId}).then((resolved) => {
    console.log(resolved);
    res.json(resolved);
  }).catch((error) => {
    console.log(error);
    res.json(error);
  });
});

module.exports = router;
