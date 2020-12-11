const express = require("express");
const userRouter = require("./routes/userRouter");
const rssRouter = require("./routes/rssRouter");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/user", userRouter);
app.use("/rss", rssRouter);

module.exports = app;
