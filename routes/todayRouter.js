const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const News = require("../models/news");
const moment = require("moment");

// @desc    Get todays news article
// @route   GET /today/politics
// @access  public
router.get(
  "/politics",
  asyncHandler(async (req, res) => {
    try {
      // get the pubdate
      let today = moment().utc().format("L");

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

// @desc    Get todays news article
// @route   GET /today/health
// @access  public
router.get(
  "/health",
  asyncHandler(async (req, res) => {
    try {
      // get the pubdate
      let today = moment().format("L");

      console.log(today);
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
