const express = require("express");
const connectDB = require("./DB/db");
const app = express();

app.use(express.json());

connectDB();

module.exports = app;
