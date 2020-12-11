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

    const oann = await parser.parseURL(
      "https://www.oann.com/category/newsroom/feed/"
    );
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

    let oannDatas;
    if (oann !== undefined) {
      oannDatas = oannDataRefactor(oann);
      saveNewsDatas(oannDatas, "OANN");
    }

    const news = await News.find();
    res.status(200).json(news);
  })
);

function oannDataRefactor(feeds) {
  let datas = [];
  feeds.items.map((feed) => {
    let url = feed.content.match(/src\/?[^>]+>/gi);
    url = url[0].replace("src=", "");

    datas.push({
      title: feed.title,
      url: feed.link,
      source: "OANN",
      imageUrl: url,
      pubDate: feed.pubDate,
      content: feed.content.replace(/<\/?[^>]+>/gi, ""),
    });
  });
  return datas;
}

async function saveNewsDatas(news, newsSource) {
  if (news !== undefined) {
    const newsData = await News.find();
    news.map((item, index) => {
      if (newsData.length === 0 || item.title !== newsData[index].title) {
        News.insertMany({
          title: item.title,
          url: item.url,
          source: newsSource,
          imageUrl: item.imageUrl,
          content: item.content,
          pubDate: item.pubDate,
        });
      }
    });
  }
  return;
}

module.exports = router;
