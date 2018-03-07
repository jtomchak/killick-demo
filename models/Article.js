const mongoose = require("mongoose"),
  slug = require("slug"),
  uniqueValidator = require("mongoose-unique-validator");

var User = mongoose.model("User");

const ArticleSchema = new mongoose.Schema(
  {
    slug: { type: String, lowercase: true, unique: true },
    title: String,
    description: String,
    body: String,
    favoritesCount: { type: Number, default: 0 },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    tagList: [{ type: String }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

ArticleSchema.plugin(uniqueValidator, { message: "is already taken" });

ArticleSchema.methods.toJSONFor = function() {
  return {
    slug: this.slug,
    title: this.title,
    description: this.description,
    body: this.body,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    tagList: this.tagList,
    author: this.author.toProfileJSONFor()
  };
};

mongoose.model("Article", ArticleSchema);
