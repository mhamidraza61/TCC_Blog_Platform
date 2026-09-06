const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    tags: {
      type: [String],
      default: [],
    },
    coverImage: {
      url: { type: String, default: null },
      // Cloudinary's own ID for this file — needed later if we ever want
      // to delete or replace the image (you can't delete a Cloudinary
      // file with just its URL, only its public_id).
      publicId: { type: String, default: null },
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Enables MongoDB's $text search across these two fields — this is what
// powers the search bar. Weighting title higher means a match in the
// title ranks above a match buried in the content.
postSchema.index({ title: "text", content: "text" }, { weights: { title: 5, content: 1 } });

module.exports = mongoose.model("Post", postSchema);
