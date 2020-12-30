const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const News = require("../models/news");

router.get(
  "/trump-pence",
  asyncHandler(async (req, res) => {
    News.createIndexes({ title: "text", content: "text" });
    let categorizedData = await News.find({
      $text: { $search: "trump, pence", $caseSensitive: false },
    }).sort({ created_at: -1 });
    res.send(categorizedData);
  })
);

router.get(
  "/biden-harris",
  asyncHandler(async (req, res) => {
    News.createIndexes({ title: "text", content: "text" });
    let categorizedData = await News.find({
      $text: { $search: "biden, harris", $caseSensitive: false },
    }).sort({ created_at: -1 });
    res.send(categorizedData);
  })
);

router.get(
  "/health",
  asyncHandler(async (req, res) => {
    News.createIndexes({ title: "text", content: "text" });
    let categorizedData = await News.find({
      $text: {
        $search: "health, covid19, covid-19, pandemic",
        $caseSensitive: false,
      },
    }).sort({ created_at: -1 });
    res.send(categorizedData);
  })
);

router.get(
  "/legislative",
  asyncHandler(async (req, res) => {
    News.createIndexes({ title: "text", content: "text" });
    let categorizedData = await News.find({
      $text: {
        $search:
          "senate, senator, congress, congressman, congresswoman, house of representative",
        $caseSensitive: false,
      },
    }).sort({ created_at: -1 });
    res.send(categorizedData);
  })
);

router.get(
  "/judicial",
  asyncHandler(async (req, res) => {
    News.createIndexes({ title: "text", content: "text" });
    let categorizedData = await News.find({
      $text: {
        $search:
          "supreme court, chief justice, associate justice, federal courts, courts",
        $caseSensitive: false,
      },
    }).sort({ created_at: -1 });
    res.send(categorizedData);
  })
);

router.get(
  "/china",
  asyncHandler(async (req, res) => {
    News.createIndexes({ title: "text", content: "text" });
    let categorizedData = await News.find({
      $text: {
        $search: "china, xi jinping ",
        $caseSensitive: false,
      },
    }).sort({ created_at: -1 });
    res.send(categorizedData);
  })
);

module.exports = router;
