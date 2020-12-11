const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const Parser = require("rss-parser");
const parser = new Parser();
const News = require("../models/news");

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const newsmax = await parser.parseURL(
      "https://www.newsmax.com/rss/Politics/1/"
    );

    const oann = await parser.parseURL("http://www.oann.com/feed/");
    const thegatewaypundit = await parser.parseURL(
      "http://www.thegatewaypundit.com/feed/?PageSpeed=noscript"
    );
    const judicialwatch = await parser.parseURL(
      "http://www.judicialwatch.org/feed/"
    );
    const thedailywire = await parser.parseURL(
      "https://www.dailywire.com/rss.xml"
    );
    const breitbart = await parser.parseURL(
      "https://www.breitbartunmasked.com/category/latest-news/feed/"
    );

    res.status(200).json(oann);

    let oannDatas;
    if (oann !== undefined) {
      oannDatas = oannData(oann);
    }
    console.log("this is the oann datas", oannDatas);
    // const newsData = await News.find();
    // if (feeds !== undefined) {
    //   feeds.items.map((item, index) => {
    //     if (newsData.length === 0 || item.title !== newsData[index].title) {
    //       console.log("this is an empty news");
    //       News.insertMany({
    //         title: item.title,
    //         url: item.link,
    //         source: "NewsMax",
    //         imageUrl: item.enclosure.url,
    //         content: item.content,
    //         pubDate: item.pubDate,
    //       });
    //     }
    //   });
    // }

    const news = await News.find();
    res.status(200).json(news);
  })
);

function oannData(feeds) {
  let datas = [];
  feeds.items.map((feed) => {
    datas.push({
      title: feed.title,
      url: feed.link,
      source: "OANN",
      imageUrl: feed.content.match(/<\/?[^>]+>/gi),
      pubDate: feed.pubDate,
      content: feed.content.replace(/<\/?[^>]+>/gi, ""),
    });
  });
  return datas;
}

module.exports = router;
