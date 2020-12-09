require("dotenv").config();

const server = require("./server");
const connectDB = require("./config/db");
const port = process.env.PORT || 5000;

connectDB();

server.get("/", (req, res) => {
  res.send("Patriot Channel is running!");
});

server.listen(port, () => {
  console.log("Running at port " + port);
});
