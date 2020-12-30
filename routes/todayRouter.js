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
      const startOfDay = new Date(
        new Date().setUTCHours(0, 0, 0, 0)
      ).toISOString();
      const endOfDay = new Date(
        new Date().setUTCHours(23, 59, 59, 999)
      ).toISOString();

      let todaysNews = await News.find({
        created_at: { $gte: startOfDay, $lte: endOfDay },
        $text: {
          $search: "trump, pence, biden, harris, election",
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
