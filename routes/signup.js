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

  const apiURL = `${requrl}/api/user`;

  axios
    .post(apiURL, req.body)
    .then(function(result) {
      res.json(result.data);
    })
    .catch(function(error) {
      console.log(error);
    });
});

module.exports = router;
