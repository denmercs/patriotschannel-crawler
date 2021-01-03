const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const News = require("../models/news");
const Parser = require("rss-parser");
const moment = require("moment");

router.get(
  "/the-gateway-pundit",
  asyncHandler(async (req, res) => {
    const newsDatabase = await News.find();
    let parser = new Parser();
    let network = "The Gateway Pundit";
    let feed = await parser.parseURL(
      "https://www.thegatewaypundit.com/feed/?PageSpeed=noscript"
    );

    let todaysFeed = [];
    feed.items.map((article) => {
      let utcDate = article.pubDate;
      let offset = moment().utcOffset();
      let localTime = moment.utc(utcDate).utcOffset(offset).format("L");

      todaysFeed.push({
        title: article.title,
        url: article.link,
        source: network,
        imageUrl: article.enclosure.url,
        pubDate: localTime,
        content: article.contentSnippet,
      });
    });

    todaysFeed.map(async (article) => {
      // if empty then add them to db
      try {
        const urls = await News.countDocuments({ url: article.url });

        if (newsDatabase.length === 0) {
          await News.insertMany(article);
        }

        if (newsDatabase.length !== 0 && urls === 0) {
          await News.insertMany(article);
        }
      } catch (err) {
        console.log(err);
      }
    });

    res.send("Added to the database");
  })
);
module.exports = router;
