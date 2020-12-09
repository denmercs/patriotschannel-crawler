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
  authors: [
    {
      type: String,
    },
  ],
  title: {
    type: String,
    require: true,
  },
  pubDate: {
    type: String,
    require: true,
  },
  country: {
    type: String,
    require: true,
  },
  language: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  imageUrl: {
    type: String,
    require: true,
  },
  content: {
    type: String,
    require: true,
  },
  comments: [
    {
      type: String,
      postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
      },
    },
  ],
});

const News = mongoose.model("News", newsSchema);
module.exports = News;
