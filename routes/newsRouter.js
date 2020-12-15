const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const News = require("../models/news");

// @desc    Post reactions in the news comment
// @route   GET /news/
// @access  private
router.get(
  "/",
  asyncHandler(async (req, res) => {
    let newsData = await News.aggregate([
      {
        $group: {
          _id: {
            url: "$url",
            source: "$source",
            title: "$title",
            likes: { $size: "$likes" },
          },
          // likes: { count: { $size: "$likes" } },
        },
      },
    ]);

    res.status(200).json(newsData);
  })
);

// @desc    Post comment in the news article
// @route   POST /news/
// @access  private
router.post(
  "/:id",
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

module.exports = router;
