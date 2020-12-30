require("dotenv").config();

const server = require("./server");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);

dotenv.config();
connectDB();

server.get("/", (req, res) => {
  res.send("Patriot Channel is running!");
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log("Running at port " + port);
});
