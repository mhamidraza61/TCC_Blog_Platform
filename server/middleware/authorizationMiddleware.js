const Post = require("../models/Post");

// Runs AFTER "protect" (so req.user already exists). Checks that the
// logged-in user is actually the author of the post they're trying to
// edit or delete. This is authorization ("are you allowed to do this?"),
// as opposed to authentication ("who are you?"), which "protect" handles.
const isPostAuthor = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }

    // post.author is an ObjectId, req.user._id is an ObjectId —
    // compare them as strings since two ObjectId objects are never
    // === equal even when they represent the same value.
    if (post.author.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized — you are not the author of this post");
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { isPostAuthor };
