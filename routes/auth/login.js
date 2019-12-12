const express = require("express");
const router = express.Router();
const axios = require("axios");
const url = require("url");

router.post("/", function(req, res) {
  const requrl = url.format({
    protocol: req.protocol,
    host: req.get("host")
    // pathname: req.originalUrl
  });

  const apiURL = `${requrl}/api/user/login`;
  axios
    .post(apiURL, {
      email: req.body.username,
      password: req.body.password
    })
    .then(function(result) {
      if (result.data.meta.success) {
        req.session.userId = result.data.result.ID;
        req.session.username = result.data.result.name;
        req.session.isInCollective =
          result.data.result.isInCollective === 1 ? true : false;
      }

      res.json(result.data.meta);
    })
    .catch(function(error) {
      console.log(error);
    });
});

module.exports = router;
