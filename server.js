const express = require("express");
const userRouter = require("./routes/userRouter");
const newsRouter = require("./routes/newsRouter");
const rssRouter = require("./routes/rssRouter");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/users", userRouter);
app.use("/rss", rssRouter);
app.use("/news", newsRouter);

module.exports = app;
