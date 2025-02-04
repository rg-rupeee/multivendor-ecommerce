const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  publishingDate: {
    type: Date,
    required: true,
  },
  coverImage: {
    type: String,
    required: true,
  },
  thumbnailImage: {
    type: String,
    required: true,
  },
  blogData: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
  },
  relatedBlogs: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Blog",
    },
  ],
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
