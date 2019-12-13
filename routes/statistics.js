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

router.post("/overdues", function(req, res) {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });
  if (!req.body.id) res.json({ status: false, msg: "missing id" });
  const sql =
    "SELECT UIC.`user_ID` AS UserID, U.`name`, COUNT(O.`user_ID`) AS NumOfOverdues FROM `User` AS U, `user_in_collective` AS UIC LEFT JOIN `Overdue` AS O ON O.`user_ID` = UIC.`user_ID` WHERE UIC.`collective_ID` = ? AND U.`ID` = UIC.`user_ID` GROUP BY UIC.`user_ID` ORDER BY COUNT(O.`user_ID`) DESC;";

  connection.query(sql, req.body.id, function(error, results, fields) {
    if (error) throw error;
    if (results) res.json(results);
  });

  connection.end();
});

router.post("/completed", function(req, res) {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });
  if (!req.body.id) res.json({ status: false, msg: "missing id" });
  const sql =
    "SELECT AVG(CH.`completed`) AS PercentageCompleted FROM `Chore` AS CH, `Collective` AS C WHERE CH.`collective_ID` = C.`ID` AND C.`ID` = ?;";

  connection.query(sql, req.body.id, function(error, results, fields) {
    if (error) throw error;
    if (results) res.json(results);
  });

  connection.end();
});

router.post("/members", function(req, res) {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });
  if (!req.body.id) res.json({ status: false, msg: "missing id" });
  const sql =
    "SELECT COUNT(*) AS NumOfMembers FROM `user_in_collective` AS C WHERE C.`collective_ID` = ?;";

  connection.query(sql, req.body.id, function(error, results, fields) {
    if (error) throw error;
    if (results) res.json(results);
  });

  connection.end();
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
