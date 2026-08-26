const Post = require("../models/Post");

// @desc    Create a new post
// @route   POST /api/posts
const createPost = async (req, res, next) => {
  try {
    const { title, content, tags } = req.body;
    // author comes from the logged-in user (set by the "protect"
    // middleware), NEVER from the request body — otherwise anyone could
    // send { "author": "<someone else's id>" } and post as them.
    const post = await Post.create({
      title,
      content,
      tags,
      author: req.user._id,
    });
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all posts
// @route   GET /api/posts
const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().populate("author", "name email");
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single post by ID
// @route   GET /api/posts/:id
const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "name email"
    );
    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }
    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { createPost, getPosts, getPostById, updatePost, deletePost };
