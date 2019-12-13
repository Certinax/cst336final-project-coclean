const express = require("express");
const router = express.Router();
const axios = require("axios");
const url = require("url");
const mysql = require("mysql2");

router.get("/", function(req, res) {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

  const sql =
    "SELECT U.`name`, U.`surname`, U.`email` , C.`name` " +
    "FROM `User` AS U " +
    "JOIN `user_in_collective` AS UIC " +
    "ON UIC.`user_ID` = U.`ID` " +
    "JOIN `Collective` AS C " +
    "ON C.`ID` = UIC.`collective_ID`;";

  connection.query(sql, function(err, result, fields) {
    if (result) {
      res.render("page/search", {
        search: true,
        title: "Search",
        username: req.session.username,
        data: result
      });
    }
  });
});

module.exports = router;
