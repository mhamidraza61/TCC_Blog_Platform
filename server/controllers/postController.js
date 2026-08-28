const Post = require("../models/Post");
const ERROR_MESSAGES = require("../constants/errorMessages");

const createPost = async (req, res, next) => {
  try {
    const { title, content, tags } = req.body;
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

const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().populate("author", "name email");
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "name email"
    );
    if (!post) {
      res.status(404);
      throw new Error(ERROR_MESSAGES.POST.NOT_FOUND);
    }
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!post) {
      res.status(404);
      throw new Error(ERROR_MESSAGES.POST.NOT_FOUND);
    }
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      res.status(404);
      throw new Error(ERROR_MESSAGES.POST.NOT_FOUND);
    }
    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { createPost, getPosts, getPostById, updatePost, deletePost };
