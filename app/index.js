const express = require("express");
var bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
pool = require("./db.js");

pool.connect(function (err) {
  if (err) throw err;
  console.log("Connected to db!");
});

app.get("/", (req, res) => {
  res.send("Welcome to the Product Catalog Management API!");
});

app.use("/api/products", require("./routes/products"));

module.exports = app;
