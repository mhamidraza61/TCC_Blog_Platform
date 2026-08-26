const express = require("express");
const router = express.Router();
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} = require("../controllers/postController");
const { protect } = require("../middleware/authMiddleware");
const { isPostAuthor } = require("../middleware/authorizationMiddleware");

// Anyone can browse posts (GET), but creating one requires login.
router.route("/").post(protect, createPost).get(getPosts);

// Anyone can view a single post, but editing/deleting requires:
// 1. protect    -> must be logged in at all
// 2. isPostAuthor -> must specifically be THIS post's author
router
  .route("/:id")
  .get(getPostById)
  .put(protect, isPostAuthor, updatePost)
  .delete(protect, isPostAuthor, deletePost);

module.exports = router;
