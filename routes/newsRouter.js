const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const News = require("../models/news");
const protect = require("../middleware/authMiddleware");
const Networks = require("../models/networks");
const googleNewsScraper = require("google-news-scraper");

// @desc    Post reactions in the news comment
// @route   GET /news/
// @access  private
router.get(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    let newsData = await News.find();

    res.status(200).json(newsData);
  })
);

// @desc    Post comment in the news article
// @route   POST /news/
// @access  private
router.post(
  "/comment/:id",
  protect,
  asyncHandler(async (req, res) => {
    let { id } = req.params;
    let { authorId, comment } = req.body;

    let updated = await News.updateOne(
      { _id: id },
      {
        $push: {
          comments: {
            comment: comment,
            authorId: authorId,
          },
        },
      }
    );

    res.status(201).json(updated);
  })
);

// @desc    Like the news article
// @route   POST /news/likes/:id
// @access  private

router.post(
  "/likes/:id",
  protect,
  asyncHandler(async (req, res) => {
    let { id } = req.params;
    let { authorId } = req.body;

    console.log(authorId);

    let updated = await News.updateOne(
      { _id: id },
      {
        $push: {
          likes: { likedBy: authorId },
        },
      }
    );

    res.status(201).json(updated);
  })
);

// get network news routes
router.get(
  "/:network/:hours",
  asyncHandler(async (req, res) => {
    try {
      const { hours, network } = req.params;

      let name = network.replace(/-/g, " ");
      networkName = name.replace(/(^\w{1})|(\s{1}\w{1})/g, (match) =>
        match.toUpperCase()
      );

      const newsDatabase = await News.find();

      const articles = await googleNewsScraper({
        searchTerm: networkName,
        prettyURLs: true,
        timeframe: hours,
        puppeteerArgs: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      let filteredNews = articles.filter(
        (article) => article.source === network
      );

      filteredNews.map(async (article) => {
        // if empty then add them to db
        try {
          const urls = await News.countDocuments({ url: article.link });

          if (newsDatabase.length === 0) {
            addNewsToDatabase(article);
          }

          if (newsDatabase.length !== 0 && urls === 0) {
            addNewsToDatabase(article);
          }
        } catch (err) {
          console.log(err);
        }
      });
      res.status(201).json({ message: "Article added, databaes updated!" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  })
);

function changeDate(article) {
  // modify the date published from string to date format
  let publishedDate = article.time.split(" ");
  let date = new Date();
  let refactoredDate = "";
  if (publishedDate[1] === "days") {
    refactoredDate = `${date.getFullYear()}-${date.getMonth() + 1}-${
      date.getDate() - publishedDate[0]
    }`;
  } else if (publishedDate[1] === "hours" || publishedDate[1] === "minutes") {
    refactoredDate = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;
  } else if (publishedDate[0] === "yesterday") {
    refactoredDate = `${date.getFullYear()}-${date.getMonth() + 1}-${
      date.getDate() - 1
    }`;
  }
  return refactoredDate;
}

function addNewsToDatabase(article) {
  let refactoredDate = changeDate(article);
  News.insertMany({
    title: article.title,
    url: article.link,
    source: article.source,
    imageUrl: article.image,
    content: article.subtitle,
    pubDate: refactoredDate,
  });
}

module.exports = router;
