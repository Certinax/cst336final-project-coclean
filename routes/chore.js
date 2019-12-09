const express = require("express");
const router = express.Router();

router.get("/", function(req, res) {
        res.render("page/chore/home", {
            title: "Chores"
        });
});


module.exports = router;