const express = require("express");
const userRouter = require("./routes/userRouter");
const newsRouter = require("./routes/newsRouter");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/user", userRouter);
app.use("/news", newsRouter);

module.exports = app;
