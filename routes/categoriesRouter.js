const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const News = require("../models/news");

router.get(
  "/trump-pence",
  asyncHandler(async (req, res) => {
    News.createIndexes({ title: "text", content: "text" });
    let categorizedData = await News.find({
      $text: { $search: "trump, pence", $caseSensitive: false },
    }).sort({ created_at: 1 });
    res.send(categorizedData);
  })
);

module.exports = router;
