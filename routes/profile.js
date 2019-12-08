const express = require('express');
const router = express.Router();

router.get("/", function (req, res) {
    res.render("profile", {
        title: "User Profile",
        username: "Christina"
    })
});

module.exports = router;