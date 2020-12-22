require("dotenv").config();

const server = require("./server");
const dotenv = require("dotenv");
const http = require("http");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

// server.get("/", (req, res) => {
//   res.send("Patriot Channel is running!");
// });

const hostname = process.env.HOST || "localhost";
const port = process.env.PORT || 5000;

const runServer = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(`{message: "Hello world!}`);
});

runServer.listen(port, hostname, () => {
  console.log(`Running at http://${hostname}:${port}`);
});
