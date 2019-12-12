const express = require("express");
const router = express.Router();
const axios = require("axios");
const url = require("url");

router.get("/", function(req, res) {
  const requrl = url.format({
    protocol: req.protocol,
    host: req.get("host")
  });

  const apiURL = `${requrl}/api/user/${req.session.userId}`;

  axios
    .get(apiURL)
    .then(function(result) {
      const { name, surname, email, school } = result.data.result[0];
      res.render("profile", {
        profile: true,
        title: "User Profile",
        username: name,
        lastname: surname,
        email: email,
        school: school
      });
    })
    .catch(function(error) {
      console.log(error);
    });
});

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

//Delete User
router.delete("/delete", function(req, res) {
  const requrl = url.format({
    protocol: req.protocol,
    host: req.get("host")
  });

  const apiURL = `${requrl}/api/user/${req.session.userId}`;

  axios
    .delete(apiURL, {
      data: {
        password: req.body.password
      }
    })
    .then(function(result) {
      if (result.data.meta.success) {
        req.session.destroy();
        res.json(result.data);
      } else {
        res.json(result.data);
      }
    })
    .catch(function(error) {
      console.log(error);
    });
});

//Update User
router.put("/update", function(req, res) {
  const requrl = url.format({
    protocol: req.protocol,
    host: req.get("host")
  });

  const apiURL = `${requrl}/api/user/${req.session.userId}`;

  axios
    .put(apiURL, {
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        newPassword: req.body.newPassword,
        oldPassword: req.body.oldPassword
    })
    .then(function(result) {

      if (result.data.meta.success) {
        res.json(result.data);
      } else {
        res.json(result.data);
      }
    })
    .catch(function(error) {
      console.log("error");
    });
});

module.exports = router;
