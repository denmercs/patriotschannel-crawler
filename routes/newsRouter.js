const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const News = require("../models/news");
const googleNewsScraper = require("google-news-scraper");
const moment = require("moment");

// @desc    Post reactions in the news comment
// @route   GET /news/
// @access  private
router.get(
  "/",
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
      const newsDatabase = await News.find();
      const { hours, network } = req.params;

      let name = network.replace(/-/g, " ");
      let networkName = name.replace(/(^\w{1})|(\s{1}\w{1})/g, (match) =>
        match.toUpperCase()
      );

      const articles = await googleNewsScraper({
        searchTerm: networkName,
        prettyURLs: true,
        timeframe: hours,
        puppeteerArgs: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      let filteredNews = articles.filter(
        (article) => article.source === networkName
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

  let refactoredDate;
  if (publishedDate[1] === "days") {
    refactoredDate = moment().subtract(publishedDate[0], "days").format("L");
  }

  if (publishedDate[0] === "Dec") {
    refactoredDate = moment(`202012${publishedDate[1]}`, "YYYYMMDD").format(
      "L"
    );
  }
  if (publishedDate[0] === "Nov") {
    refactoredDate = moment(`202011${publishedDate[1]}`, "YYYYMMDD").format(
      "L"
    );
  }

  if (
    publishedDate[1] === "hours" ||
    publishedDate[1] === "hour" ||
    publishedDate[1] === "minutes" ||
    publishedDate[1] === "seconds"
  ) {
    refactoredDate = moment().format("L");
  }

  if (publishedDate[0].toLowerCase() === "yesterday") {
    refactoredDate = moment().subtract(1, "days").format("L");
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
