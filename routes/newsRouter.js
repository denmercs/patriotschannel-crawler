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
  "/the-epoch-times",
  asyncHandler(async (req, res) => {
    try {
      const newsDatabase = await News.find();

      const articles = await googleNewsScraper({
        searchTerm: "The Epoch Times",
        prettyURLs: true,
        timeframe: "30d",
        puppeteerArgs: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      articles.map(async (article) => {
        if (article.source === "The Epoch Times") {
          if (newsDatabase.length === 0 && newsDatabase !== undefined) {
            let refactoredDate = changeDate(article);
            News.insertMany({
              title: article.title,
              url: article.link,
              source: article.source,
              imageUrl: article.image,
              content: article.subtitle,
              pubDate: refactoredDate,
            });
            res
              .status(201)
              .json({ message: "Added articles in the database!" });
          } else {
            let data = await News.find({ url: article.link });
            if (Object.keys(data).length === 0) {
              let refactoredDate = changeDate(article);
              News.insertMany({
                title: article.title,
                url: article.link,
                source: article.source,
                imageUrl: article.image,
                content: article.subtitle,
                pubDate: refactoredDate,
              });
              res.status(200).json({ message: "Database updated!" });
            }
          }
          res
            .status(200)
            .json({ message: "No articles added in the database." });
        }
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  })
);

router.get(
  "/breitbart",
  asyncHandler(async (req, res) => {
    try {
      const newsDatabase = await News.find();

      const articles = await googleNewsScraper({
        searchTerm: "Breitbart",
        prettyURLs: true,
        timeframe: "1d",
        puppeteerArgs: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      articles.map(async (article) => {
        if (article.source === "Breitbart") {
          if (newsDatabase.length === 0 && newsDatabase !== undefined) {
            let refactoredDate = changeDate(article);
            News.insertMany({
              title: article.title,
              url: article.link,
              source: article.source,
              imageUrl: article.image,
              content: article.subtitle,
              pubDate: refactoredDate,
            });
            res
              .status(201)
              .json({ message: "Added articles in the database!" });
          } else {
            let data = await News.find({ url: article.link });
            if (Object.keys(data).length === 0) {
              let refactoredDate = changeDate(article);
              News.insertMany({
                title: article.title,
                url: article.link,
                source: article.source,
                imageUrl: article.image,
                content: article.subtitle,
                pubDate: refactoredDate,
              });
              res.status(200).json({ message: "Database updated!" });
            }
          }
          res.status(200).json({ message: "No article added in the database" });
        }
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  })
);

router.get(
  "/oann",
  asyncHandler(async (req, res) => {
    try {
      const newsDatabase = await News.find();

      const articles = await googleNewsScraper({
        searchTerm: "One America News Network",
        prettyURLs: true,
        timeframe: "1d",
        puppeteerArgs: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      articles.map(async (article) => {
        if (article.source === "One America News Network") {
          if (newsDatabase.length === 0 && newsDatabase !== undefined) {
            let refactoredDate = changeDate(article);
            News.insertMany({
              title: article.title,
              url: article.link,
              source: article.source,
              imageUrl: article.image,
              content: article.subtitle,
              pubDate: refactoredDate,
            });
            res
              .status(201)
              .json({ message: "Added articles in the database!" });
          } else {
            let data = await News.find({ url: article.link });
            if (Object.keys(data).length === 0) {
              let refactoredDate = changeDate(article);
              News.insertMany({
                title: article.title,
                url: article.link,
                source: article.source,
                imageUrl: article.image,
                content: article.subtitle,
                pubDate: refactoredDate,
              });
              res.status(200).json({ message: "Database updated!" });
            }
          }
          res.status(200).json({ message: "No article added in the database" });
        }
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  })
);

router.get(
  "/the-federalist",
  asyncHandler(async (req, res) => {
    try {
      const newsDatabase = await News.find();

      const articles = await googleNewsScraper({
        searchTerm: "The Federalist",
        prettyURLs: true,
        timeframe: "1d",
        puppeteerArgs: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      articles.map(async (article) => {
        if (article.source === "The Federalist") {
          if (newsDatabase.length === 0 && newsDatabase !== undefined) {
            let refactoredDate = changeDate(article);
            News.insertMany({
              title: article.title,
              url: article.link,
              source: article.source,
              imageUrl: article.image,
              content: article.subtitle,
              pubDate: refactoredDate,
            });
            res
              .status(201)
              .json({ message: "Added articles in the database!" });
          } else {
            let data = await News.find({ url: article.link });
            if (Object.keys(data).length === 0) {
              let refactoredDate = changeDate(article);
              News.insertMany({
                title: article.title,
                url: article.link,
                source: article.source,
                imageUrl: article.image,
                content: article.subtitle,
                pubDate: refactoredDate,
              });
              res.status(200).json({ message: "Database updated!" });
            }
          }
          res.status(200).json({ message: "No article added in the database" });
        }
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  })
);

router.get(
  "/newsmax",
  asyncHandler(async (req, res) => {
    try {
      const newsDatabase = await News.find();

      const articles = await googleNewsScraper({
        searchTerm: "Newsmax",
        prettyURLs: true,
        timeframe: "1d",
        puppeteerArgs: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      articles.map(async (article) => {
        if (article.source === "Newsmax") {
          if (newsDatabase.length === 0 && newsDatabase !== undefined) {
            let refactoredDate = changeDate(article);
            News.insertMany({
              title: article.title,
              url: article.link,
              source: article.source,
              imageUrl: article.image,
              content: article.subtitle,
              pubDate: refactoredDate,
            });
            res
              .status(201)
              .json({ message: "Added articles in the database!" });
          } else {
            let data = await News.find({ url: article.link });
            if (Object.keys(data).length === 0) {
              let refactoredDate = changeDate(article);
              News.insertMany({
                title: article.title,
                url: article.link,
                source: article.source,
                imageUrl: article.image,
                content: article.subtitle,
                pubDate: refactoredDate,
              });
              res.status(200).json({ message: "Database updated!" });
            }
          }
          res.status(200).json({ message: "No article added in the database" });
        }
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  })
);

router.get(
  "/american-thinker",
  asyncHandler(async (req, res) => {
    try {
      const newsDatabase = await News.find();

      const articles = await googleNewsScraper({
        searchTerm: "American Thinker",
        prettyURLs: true,
        timeframe: "1d",
        puppeteerArgs: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      articles.map(async (article) => {
        if (article.source === "American Thinker") {
          if (newsDatabase.length === 0 && newsDatabase !== undefined) {
            let refactoredDate = changeDate(article);
            News.insertMany({
              title: article.title,
              url: article.link,
              source: article.source,
              imageUrl: article.image,
              content: article.subtitle,
              pubDate: refactoredDate,
            });
            res
              .status(201)
              .json({ message: "Added articles in the database!" });
          } else {
            try {
              let data = await News.find({ url: article.link });
              if (Object.keys(data).length === 0) {
                let refactoredDate = changeDate(article);
                News.insertMany({
                  title: article.title,
                  url: article.link,
                  source: article.source,
                  imageUrl: article.image,
                  content: article.subtitle,
                  pubDate: refactoredDate,
                });
                res.status(200).json({ message: "Database updated!" });
              }
            } catch (err) {
              res.status(400).json({ message: err.message });
            }
          }
          res.status(200).json({ message: "No article added in the database" });
        }
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  })
);

router.get(
  "/washington-times",
  asyncHandler(async (req, res) => {
    try {
      const newsDatabase = await News.find();

      const articles = await googleNewsScraper({
        searchTerm: "Washington Times",
        prettyURLs: true,
        timeframe: "1d",
        puppeteerArgs: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      articles.map(async (article) => {
        if (article.source === "Washington Times") {
          if (newsDatabase.length === 0 && newsDatabase !== undefined) {
            let refactoredDate = changeDate(article);
            News.insertMany({
              title: article.title,
              url: article.link,
              source: article.source,
              imageUrl: article.image,
              content: article.subtitle,
              pubDate: refactoredDate,
            });
            res
              .status(201)
              .json({ message: "Added articles in the database!" });
          } else {
            try {
              let data = await News.find({ url: article.link });
              if (Object.keys(data).length === 0) {
                let refactoredDate = changeDate(article);
                News.insertMany({
                  title: article.title,
                  url: article.link,
                  source: article.source,
                  imageUrl: article.image,
                  content: article.subtitle,
                  pubDate: refactoredDate,
                });
                res.status(200).json({ message: "Database updated!" });
              }
            } catch (err) {
              res.status(400).json({ message: err.message });
            }
          }
          res.status(200).json({ message: "No article added in the database" });
        }
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  })
);

router.get(
  "/christianity-daily",
  asyncHandler(async (req, res) => {
    try {
      const newsDatabase = await News.find();

      const articles = await googleNewsScraper({
        searchTerm: "Christianity Daily",
        prettyURLs: true,
        timeframe: "1d",
        puppeteerArgs: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      articles.map(async (article) => {
        if (article.source === "Christianity Daily") {
          if (newsDatabase.length === 0 && newsDatabase !== undefined) {
            let refactoredDate = changeDate(article);
            News.insertMany({
              title: article.title,
              url: article.link,
              source: article.source,
              imageUrl: article.image,
              content: article.subtitle,
              pubDate: refactoredDate,
            });
            res
              .status(201)
              .json({ message: "Added articles in the database!" });
          } else {
            try {
              let data = await News.find({ url: article.link });
              if (Object.keys(data).length === 0) {
                let refactoredDate = changeDate(article);
                News.insertMany({
                  title: article.title,
                  url: article.link,
                  source: article.source,
                  imageUrl: article.image,
                  content: article.subtitle,
                  pubDate: refactoredDate,
                });
                res.status(200).json({ message: "Database updated!" });
              }
            } catch (err) {
              res.status(400).json({ message: err.message });
            }
          }
          res.status(200).json({ message: "No article added in the database" });
        }
      });
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

module.exports = router;
