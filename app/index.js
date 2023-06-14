const express = require("express");
var bodyParser = require("body-parser");
const app = express();
const pool = require("./db.js");
const logger = require("./logger.js");
app.use(bodyParser.json());

pool.connect(function (err) {
  if (err) throw err;
  logger.info("Connected to db!");
});

app.get("/", (req, res) => {
  res.send("Welcome to the Product Catalog Management API!");
});

app.use("/api/products", require("./routes/products"));

module.exports = app;
