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
const upload = require("../middleware/upload");

// upload.single("coverImage") looks for a file field named "coverImage"
// in the incoming multipart/form-data request, parses it into req.file,
// and leaves the rest of the fields (title, content, tags) in req.body
// exactly as before — createPost doesn't need to know multer was involved.
router.route("/").post(protect, upload.single("coverImage"), createPost).get(getPosts);

router
  .route("/:id")
  .get(getPostById)
  .put(protect, isPostAuthor, upload.single("coverImage"), updatePost)
  .delete(protect, isPostAuthor, deletePost);

module.exports = router;
