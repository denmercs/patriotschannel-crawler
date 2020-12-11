const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const Parser = require("rss-parser");
const parser = new Parser();
const News = require("../models/news");
const googleNewsScraper = require("google-news-scraper");

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

router.get("/:search", asyncHandler(async(req, res) => {
  const searchNetwork = req.params.search;
  console.log('thhis is the search network', searchNetwork);
  let network = "";

  // make a switch statement for all conservative sites
  switch (searchNetwork) {
    case "the-epoch-times":
      network = "The Epoch Times"
      break;
    default:
      return network;
  }  

  const search = await googleNewsScraper(
    {
      searchTerm: network,
      prettyURLs: true,
      timeframe: "5d",
      puppeteerArgs: ['--no-sandbox', '--disable-setuid-sandbox']
    }
  )
  
  let updatedArticle = [];
  search.filter(article => {

    // if the search article is found
    if(article.source === network) {
      // modify the date published from string to date format
      let publishedDate = article.time.split(" ")
      let date = new Date();

      if(publishedDate[1] === "days") {
        let refactoredDate = `${date.getFullYear()}-${(date.getMonth() + 1)}-${(date.getDate() - publishedDate[0])}`;
        updatedArticle.push({
          title: article.title,
          url: article.link,
          imageUrl: article.image,
          source: article.source,
          content: article.subtitle,
          pubDate: refactoredDate
        })
      }
      if (publishedDate[1] === "hours" && publishedDate[1] === "minutes") {
        let refactoredDate = `${date.getFullYear()}-${(date.getMonth() + 1)}-${(date.getDate())}`;
        updatedArticle.push({
          title: article.title,
          url: article.link,
          imageUrl: article.image,
          source: article.source,
          content: article.subtitle,
          pubDate: refactoredDate
        })
      }
      if (publishedDate[0].toLowerCase() === "yesterday") {
        let refactoredDate = `${date.getFullYear()}-${(date.getMonth() + 1)}-${(date.getDate() - 1)}`;
        updatedArticle.push({
          title: article.title,
          url: article.link,
          imageUrl: article.image,
          source: article.source,
          content: article.subtitle,
          pubDate: refactoredDate
        })
      }
    }
  });



  res.send(updatedArticle)
  
}))

module.exports = router;
