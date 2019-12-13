const express = require("express");
const router = express.Router();
const axios = require("axios");
const url = require("url");

router.get("/", function(req, res) {
  if (req.session.userId && req.session.isInCollective) {
    res.render("page/collective/home", {
      collective: true,
      title: "Collective",
      username: req.session.username,
      userId: req.session.userId
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
  if (
    req.session.userId &&
    req.session.isInCollective &&
    req.session.userId === req.session.collectiveAdminId
  ) {
    const requrl = url.format({
      protocol: req.protocol,
      host: req.get("host")
    });

    const apiURL = `${requrl}/api/collective/${req.session.collectiveId}`;
    axios
      .get(apiURL)
      .then(function(result) {
        console.log(result);
        const { name, description, school } = result.data.result[0];
        res.render("page/collective/edit", {
          collective: true,
          title: "Edit Collective",
          username: req.session.username,
          collectiveName: name,
          description: description,
          school: school
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  } else {
    res.redirect("/collective");
  }
});

router.post("/create", function(req, res) {
  if (req.session.userId) {
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
        console.log(result.data);
        if (result.data.meta.success && result.data.result[0]) {
          req.session.isInCollective = true;
          req.session.collectiveId = result.data.result[0].collectiveId;
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

router.put("/edit", function(req, res) {
  if (req.session.userId) {
    const requrl = url.format({
      protocol: req.protocol,
      host: req.get("host")
      // pathname: req.originalUrl
    });

    const apiURL = `${requrl}/api/collective/${req.session.collectiveId}`;
    const { name, description, school } = req.body;
    axios
      .put(apiURL, {
        name: name,
        description: description,
        school: school,
        userId: req.session.userId
      })
      .then(function(result) {
        res.json(result.data.meta);
      })
      .catch(function(error) {
        console.log(error);
      });
  } else {
    res.redirect("/");
  }
});

router.delete("/delete", function(req, res) {
  if (req.session.userId && req.session.collectiveId) {
    const requrl = url.format({
      protocol: req.protocol,
      host: req.get("host")
      // pathname: req.originalUrl
    });

    const apiURL = `${requrl}/api/collective/${req.session.collectiveId}`;
    axios
      .delete(apiURL)
      .then(function(result) {
        if (result.data.meta.success) {
          req.session.isInCollective = false;
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

router.post("/join", function(req, res) {
  if (req.session.userId && !req.session.isInCollective) {
    const requrl = url.format({
      protocol: req.protocol,
      host: req.get("host")
    });

    const apiURL = `${requrl}/api/user/${req.session.userId}/join`;
    axios
      .post(apiURL, {
        key: req.body.key
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

router.post("/leave", (req, res, next) => {
  let { userId, collectiveId } = req.body;
  userId = 15;
  collectiveId = 20;
  const URL = req.headers.referer + `api/user/${userId}/leave`;
  axios
    .post(URL, { collectiveId })
    .then(resolved => {
      console.log(resolved);
      res.json(resolved);
    })
    .catch(error => {
      console.log(error);
      res.json(error);
    });
});

module.exports = router;
