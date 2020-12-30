const express = require("express");
const userRouter = require("./routes/userRouter");
const newsRouter = require("./routes/newsRouter");
const rssRouter = require("./routes/rssRouter");
const categoriesRouter = require("./routes/categoriesRouter");
const stripe = require("./routes/stripePayment");
const networksRouter = require("./routes/networksRouter");

const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/users", userRouter);
app.use("/rss", rssRouter);
app.use("/news", newsRouter);
app.use("/stripe", stripe);
app.use("/networks", networksRouter);
app.use("/categories", categoriesRouter);

module.exports = app;
