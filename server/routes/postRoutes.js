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

router.route("/").post(protect, createPost).get(getPosts);

router
  .route("/:id")
  .get(getPostById)
  .put(protect, isPostAuthor, updatePost)
  .delete(protect, isPostAuthor, deletePost);

module.exports = router;
