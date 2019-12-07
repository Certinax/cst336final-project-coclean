const express = require('express');
const router = express.Router();

router.get("/", function (req, res) {
    res.render("profile", {
        title: "User Profile"
    })
});

module.exports = router;