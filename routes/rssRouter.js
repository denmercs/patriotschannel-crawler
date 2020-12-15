const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const News = require("../models/news");
const googleNewsScraper = require("google-news-scraper");

// @desc    Scrapping News Articles
// @route   POST /news/:search
// @access  public
router.get(
  "/:search",
  asyncHandler(async (req, res) => {
    const searchNetwork = req.params.search;
    let network = "";
    const newsDatabase = await News.find();
    // make a switch statement for all conservative sites
    switch (searchNetwork) {
      case "the-epoch-times":
        network = "The Epoch Times";
        break;
      case "one-america-news-network":
        network = "One America News Network";
        break;
      case "newsmax":
        network = "Newsmax";
        break;
      case "breitbart":
        network = "Breitbart";
        break;
      default:
        return network;
    }
    const search = await googleNewsScraper({
      searchTerm: network,
      prettyURLs: true,
      timeframe: "5d",
      puppeteerArgs: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    let filteredNewsSource = search.filter(
      (article) => article.source === network
    );
    if (newsDatabase.length === 0 && newsDatabase !== undefined) {
      filteredNewsSource.map((article) => {
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
      filteredNewsSource.map(async (article) => {
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
