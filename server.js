const express = require("express");
const newsRouter = require("./routes/newsRouter");
const rssRouter = require("./routes/rssRouter");

const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/rss", rssRouter);
app.use("/news", newsRouter);

module.exports = app;
