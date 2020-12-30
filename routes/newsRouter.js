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

// @desc    Get breaking in the news article
// @route   GET /news/breaking
// @access  private
router.get(
  "/today",
  asyncHandler(async (req, res) => {
    try {
      let start = new Date();
      start.setHours(0, 0, 0, 0);

      let end = new Date();
      end.setHours(23, 59, 59, 999);

      let breakingNews = await News.find({
        created_at: { $gte: start, $lt: end },
      });

      res.send(breakingNews);
    } catch (err) {
      res.status(400).json(err);
    }
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
  protect,
  asyncHandler(async (req, res) => {
    let network = await Networks.find();
    const newsDatabase = await News.find();

    const articles = await googleNewsScraper({
      searchTerm: network[0].name,
      prettyURLs: true,
      timeframe: "2d",
      puppeteerArgs: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    let filteredArticles = articles.filter(
      (article) => article.source === network[0].name
    );

    if (newsDatabase.length === 0 && newsDatabase !== undefined) {
      filteredArticles.map((article) => {
        // if the search article is found
        let refactoredDate = changeDate(article);
        News.insertMany({
          title: article.title,
          url: article.link,
          source: article.source,
          imageUrl: article.image,
          content: article.subtitle,
          pubDate: refactoredDate,
        });
      });
      res.status(200).json({ message: "Added" });
    } else {
      filteredArticles.map(async (article) => {
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
        } else {
          return;
        }
      });
      res.status(200).json({ message: "Database updated!" });
    }
  })
);

router.get(
  "/breitbart",
  protect,
  asyncHandler(async (req, res) => {
    let network = await Networks.find();
    const newsDatabase = await News.find();

    const articles = await googleNewsScraper({
      searchTerm: network[1].name,
      prettyURLs: true,
      timeframe: "2d",
      puppeteerArgs: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    let filteredArticles = articles.filter(
      (article) => article.source === network[1].name
    );

    if (newsDatabase.length === 0 && newsDatabase !== undefined) {
      filteredArticles.map((article) => {
        // if the search article is found
        let refactoredDate = changeDate(article);
        News.insertMany({
          title: article.title,
          url: article.link,
          source: article.source,
          imageUrl: article.image,
          content: article.subtitle,
          pubDate: refactoredDate,
        });
      });
      res.status(200).json({ message: "Added" });
    } else {
      filteredArticles.map(async (article) => {
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
        } else {
          return;
        }
      });
      res.status(200).json({ message: "Database updated!" });
    }
    res.send(articles);
  })
);

router.get(
  "/oann",
  protect,
  asyncHandler(async (req, res) => {
    let network = await Networks.find();
    const newsDatabase = await News.find();

    const articles = await googleNewsScraper({
      searchTerm: network[2].name,
      prettyURLs: true,
      timeframe: "2d",
      puppeteerArgs: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    let filteredArticles = articles.filter(
      (article) => article.source === network[2].name
    );

    if (newsDatabase.length === 0 && newsDatabase !== undefined) {
      filteredArticles.map((article) => {
        // if the search article is found
        let refactoredDate = changeDate(article);
        News.insertMany({
          title: article.title,
          url: article.link,
          source: article.source,
          imageUrl: article.image,
          content: article.subtitle,
          pubDate: refactoredDate,
        });
      });
      res.status(200).json({ message: "Added" });
    } else {
      filteredArticles.map(async (article) => {
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
        } else {
          return;
        }
      });
      res.status(200).json({ message: "Database updated!" });
    }
    res.send(articles);
  })
);

router.get(
  "/the-federalist",
  protect,
  asyncHandler(async (req, res) => {
    let network = await Networks.find();
    const newsDatabase = await News.find();

    const articles = await googleNewsScraper({
      searchTerm: network[4].name,
      prettyURLs: true,
      timeframe: "2d",
      puppeteerArgs: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    let filteredArticles = articles.filter(
      (article) => article.source === network[4].name
    );

    if (newsDatabase.length === 0 && newsDatabase !== undefined) {
      filteredArticles.map((article) => {
        // if the search article is found
        let refactoredDate = changeDate(article);
        News.insertMany({
          title: article.title,
          url: article.link,
          source: article.source,
          imageUrl: article.image,
          content: article.subtitle,
          pubDate: refactoredDate,
        });
      });
      res.status(200).json({ message: "Added" });
    } else {
      filteredArticles.map(async (article) => {
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
        } else {
          return;
        }
      });
      res.status(200).json({ message: "Database updated!" });
    }
    res.send(articles);
  })
);

router.get(
  "/newsmax",
  asyncHandler(async (req, res) => {
    let network = await Networks.find();
    const newsDatabase = await News.find();

    const articles = await googleNewsScraper({
      searchTerm: network[3].name,
      prettyURLs: true,
      timeframe: "2d",
      puppeteerArgs: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    let filteredArticles = articles.filter(
      (article) => article.source === network[3].name
    );

    if (newsDatabase.length === 0 && newsDatabase !== undefined) {
      filteredArticles.map((article) => {
        // if the search article is found
        let refactoredDate = changeDate(article);
        News.insertMany({
          title: article.title,
          url: article.link,
          source: article.source,
          imageUrl: article.image,
          content: article.subtitle,
          pubDate: refactoredDate,
        });
      });
      res.status(200).json({ message: "Added" });
    } else {
      filteredArticles.map(async (article) => {
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
        } else {
          return;
        }
      });
      res.status(200).json({ message: "Database updated!" });
    }
    res.send(articles);
  })
);

router.get(
  "/american-thinker",
  asyncHandler(async (req, res) => {
    let network = await Networks.find();
    const newsDatabase = await News.find();

    const articles = await googleNewsScraper({
      searchTerm: network[5].name,
      prettyURLs: true,
      timeframe: "2d",
      puppeteerArgs: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    let filteredArticles = articles.filter(
      (article) => article.source === network[5].name
    );

    if (newsDatabase.length === 0 && newsDatabase !== undefined) {
      filteredArticles.map((article) => {
        // if the search article is found
        let refactoredDate = changeDate(article);
        News.insertMany({
          title: article.title,
          url: article.link,
          source: article.source,
          imageUrl: article.image,
          content: article.subtitle,
          pubDate: refactoredDate,
        });
      });
      res.status(200).json({ message: "Added" });
    } else {
      filteredArticles.map(async (article) => {
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
        } else {
          return;
        }
      });
      res.status(200).json({ message: "Database updated!" });
    }
    res.send(articles);
  })
);

router.get(
  "/washington-times",
  protect,
  asyncHandler(async (req, res) => {
    let network = await Networks.find();
    const newsDatabase = await News.find();

    const articles = await googleNewsScraper({
      searchTerm: network[6].name,
      prettyURLs: true,
      timeframe: "2d",
      puppeteerArgs: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    let filteredArticles = articles.filter(
      (article) => article.source === network[6].name
    );

    if (newsDatabase.length === 0 && newsDatabase !== undefined) {
      filteredArticles.map((article) => {
        // if the search article is found
        let refactoredDate = changeDate(article);
        News.insertMany({
          title: article.title,
          url: article.link,
          source: article.source,
          imageUrl: article.image,
          content: article.subtitle,
          pubDate: refactoredDate,
        });
      });
      res.status(200).json({ message: "Added" });
    } else {
      filteredArticles.map(async (article) => {
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
        } else {
          return;
        }
      });
      res.status(200).json({ message: "Database updated!" });
    }
    res.send(articles);
  })
);

router.get(
  "/christianity-daily",
  asyncHandler(async (req, res) => {
    let network = await Networks.find();
    const newsDatabase = await News.find();

    const articles = await googleNewsScraper({
      searchTerm: network[7].name,
      prettyURLs: true,
      timeframe: "2d",
      puppeteerArgs: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    let filteredArticles = articles.filter(
      (article) => article.source === network[7].name
    );

    if (newsDatabase.length === 0 && newsDatabase !== undefined) {
      filteredArticles.map((article) => {
        // if the search article is found
        let refactoredDate = changeDate(article);
        News.insertMany({
          title: article.title,
          url: article.link,
          source: article.source,
          imageUrl: article.image,
          content: article.subtitle,
          pubDate: refactoredDate,
        });
      });
      res.status(200).json({ message: "Added" });
    } else {
      filteredArticles.map(async (article) => {
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
        } else {
          return;
        }
      });
      res.status(200).json({ message: "Database updated!" });
    }
    res.send(articles);
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
