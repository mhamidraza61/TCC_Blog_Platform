const Post = require("../models/Post");
const ERROR_MESSAGES = require("../constants/errorMessages");

const isPostAuthor = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error(ERROR_MESSAGES.POST.NOT_FOUND);
    }

    if (post.author.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error(ERROR_MESSAGES.POST.NOT_AUTHOR);
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { isPostAuthor };
