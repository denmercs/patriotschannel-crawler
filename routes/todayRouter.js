const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const News = require("../models/news");

// @desc    Get breaking in the news article
// @route   GET /news/breaking
// @access  private
router.get(
  "/politics",
  asyncHandler(async (req, res) => {
    try {
      let date = new Date();
      let today = `${date.getUTCFullYear()}-${
        date.getUTCMonth() + 1
      }-${date.getUTCDate()}`;

      console.log(today);

      let todaysNews = await News.find({
        pubDate: today,
        $text: {
          $search: "trump pence biden harris election deep state",
          $caseSensitive: false,
        },
      });

      res.send(todaysNews);
    } catch (err) {
      res.status(400).json(err);
    }
  })
);

router.get(
  "/health",
  asyncHandler(async (req, res) => {
    try {
      // const startOfDay = new Date(
      //   new Date().setUTCHours(0, 0, 0, 0)
      // ).toISOString();
      // const endOfDay = new Date(
      //   new Date().setUTCHours(23, 59, 59, 999)
      // ).toISOString();

      // let todaysNews = await News.find({
      //   pubDate: { $gte: startOfDay, $lte: endOfDay },
      //   $text: {
      //     $search: "covid-19, pandemic, vaccine, vaccines, bill gates, fauci",
      //     $caseSensitive: false,
      //   },
      // });
      let date = new Date();
      let today = `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}`;

      let todaysNews = await News.find({
        pubDate: today,
        $text: {
          $search: "covid-19, pandemic, vaccine, vaccines, bill gates, fauci",
          $caseSensitive: false,
        },
      });

      res.send(todaysNews);
    } catch (err) {
      res.status(400).json(err);
    }
  })
);

module.exports = router;
