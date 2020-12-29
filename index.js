require("dotenv").config();

const server = require("./server");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

server.get("/", (req, res) => {
  res.send("Patriot Channel is running!");
});

const PORT = process.env.PORT || 5000;
server.set("port", PORT);
