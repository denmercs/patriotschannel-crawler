const mongoose = require("mongoose");

const newsSchema = mongoose.Schema(
  {
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
    likes: [
      {
        likedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
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

    factCheck: [
      {
        fake: [
          {
            authorId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
            },
          },
        ],
        facts: [
          {
            authorId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
            },
          },
        ],
        url: { type: String },
      },
    ],

    comments: [
      {
        comment: { type: String, require: true },
        authorId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        likes: [
          {
            likedBy: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
            },
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
                likedBy: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "User",
                },
              },
            ],
            time: {
              type: Date,
              default: Date.now,
            },
          },
        ],
      },
    ],
  },
  { timestamps: { createdAt: "created_at", updatedAt: "udpated_at" } }
);

const News = mongoose.model("News", newsSchema);
module.exports = News;
