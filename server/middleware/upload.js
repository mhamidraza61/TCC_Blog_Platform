const multer = require("multer");
const ERROR_MESSAGES = require("../constants/errorMessages");

// memoryStorage keeps the uploaded file as a Buffer in RAM (req.file.buffer)
// instead of writing it to disk first. We never need it on disk — it gets
// streamed straight to Cloudinary and then discarded. This also matters
// for deployment: most hosts (Render, Railway) wipe the filesystem on
// every restart, so disk storage would just lose files anyway.
const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error(ERROR_MESSAGES.POST.INVALID_IMAGE_TYPE), false);
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = upload;
