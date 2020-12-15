const mongoose = require("mongoose");

const newsSchema = mongoose.Schema({
  url: {
    type: String,
    require: true,
  },
  source: {
    type: String,
    require: true,
  },
  title: {
    type: String,
    require: true,
  },
  source: {
    type: String,
  },
  likes: [
    {
      liked_by: mongoose.Schema.Types.ObjectId,
    },
  ],
  pubDate: {
    type: String,
  },
  country: {
    type: String,
  },
  language: {
    type: String,
  },
  imageUrl: {
    type: String,
  },

  content: {
    type: String,
  },
  comments: [
    {
      comment: { type: String, require: true },
      authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      likes: [
        {
          liked_by: mongoose.Schema.Types.ObjectId,
        },
      ],
      reactions: [
        {
          comment: { type: String, require: true },
          authorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          likes: [
            {
              liked_by: mongoose.Schema.Types.ObjectId,
            },
          ],
          time: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      time: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const News = mongoose.model("News", newsSchema);
module.exports = News;
