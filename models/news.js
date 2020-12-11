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
  source: [
    {
      type: String,
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
