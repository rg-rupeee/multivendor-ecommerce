const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  publishingDate: {
    type: Date,
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

const Blog = mongoose.model(blogSchema, "Blog");

module.exports = Blog;
