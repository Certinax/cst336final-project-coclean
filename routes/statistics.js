const express = require("express");
const router = express.Router();
const axios = require("axios");
const url = require("url");
const mysql = require("mysql2");

router.get("/", function(req, res) {
  res.render("page/statistics", {
    statistics: true,
    title: "Statistics"
  });
});

router.post("/test", function(req, res) {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

  const sql =
    "INSERT INTO User (name, surname, email, password) VALUES ('Stine', 'Tollerud', 'sti@tol.no', '123');";

  connection.query(sql, function(error, results, fields) {
    if (error) throw error;
    console.log(results);
    if (results) {
      res.json({ results });
    }
  });
});

module.exports = router;
