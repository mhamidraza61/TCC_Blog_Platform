const Post = require("../models/Post");
const ERROR_MESSAGES = require("../constants/errorMessages");
const streamUpload = require("../utils/streamUpload");

// @desc    Create a new post, with an optional cover image
// @route   POST /api/posts
const createPost = async (req, res, next) => {
  try {
    const { title, content, tags } = req.body;

    let coverImage = { url: null, publicId: null };

    // req.file only exists if a file was actually attached (multer sets
    // this) — the cover image is optional, so we skip the upload
    // entirely when nothing was sent, rather than erroring.
    if (req.file) {
      const result = await streamUpload(req.file.buffer);
      coverImage = { url: result.secure_url, publicId: result.public_id };
    }

    // tags can arrive as a real array (JSON request) or as a single
    // comma-separated string (multipart/form-data can't send arrays
    // directly) — handle both so the API works the same either way.
    const parsedTags = Array.isArray(tags)
      ? tags
      : typeof tags === "string" && tags.length > 0
      ? tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const post = await Post.create({
      title,
      content,
      tags: parsedTags,
      coverImage,
      author: req.user._id,
    });

    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all posts — supports pagination, filtering, and search
// @route   GET /api/posts?page=1&limit=10&author=<id>&tag=mern&search=react
const getPosts = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);
    const skip = (page - 1) * limit;

    // Build the filter object piece by piece — only add a condition if
    // the corresponding query param was actually provided, so
    // GET /api/posts with no params still returns everything.
    const filter = {};

    if (req.query.author) {
      filter.author = req.query.author;
    }

    if (req.query.tag) {
      filter.tags = req.query.tag;
    }

    if (req.query.search) {
      // Uses the text index defined on the Post model — MongoDB's own
      // relevance-ranked text search, not a slow regex scan.
      filter.$text = { $search: req.query.search };
    }

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .populate("author", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Post.countDocuments(filter),
    ]);

    res.status(200).json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
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
      throw new Error(ERROR_MESSAGES.POST.NOT_FOUND);
    }
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a post, optionally replacing its cover image
// @route   PUT /api/posts/:id
const updatePost = async (req, res, next) => {
  try {
    const updates = { ...req.body };

    if (typeof updates.tags === "string") {
      updates.tags = updates.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }

    if (req.file) {
      const result = await streamUpload(req.file.buffer);
      updates.coverImage = { url: result.secure_url, publicId: result.public_id };
    }

    const post = await Post.findByIdAndUpdate(req.params.id, updates, {
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

// @desc    Delete a post
// @route   DELETE /api/posts/:id
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
