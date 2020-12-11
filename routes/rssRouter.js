const router = require("express").Router();
const asyncHandler = require("express-async-handler");
let Parser = require("rss-parser");
let parser = new Parser();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    let feed = await parser.parseURL("https://www.newsmax.com/rss/Politics/1/");

    res.status(200).json(feed);
  })
);

module.exports = router;
