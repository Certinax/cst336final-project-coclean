const express = require("express");
const router = express.Router();
const axios = require("axios");
const url = require("url");

router.get("/", function(req, res) {
  console.log("Backend logout", req.session.username);
  if (req.session.userId) {
    req.session.destroy();
    res.json({
      message: "logout",
      success: true
    });
  } else {
    res.json({
      message: "logout failed",
      success: false
    });
  }
});

module.exports = router;
