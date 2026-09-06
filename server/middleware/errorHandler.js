const ERROR_MESSAGES = require("../constants/errorMessages");

const notFound = (req, res, next) => {
  const error = new Error(ERROR_MESSAGES.GENERIC.ROUTE_NOT_FOUND(req.originalUrl));
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = ERROR_MESSAGES.GENERIC.RESOURCE_NOT_FOUND;
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  if (err.code === 11000) {
    statusCode = 400;
    message = ERROR_MESSAGES.GENERIC.DUPLICATE_FIELD(
      Object.keys(err.keyValue).join(", ")
    );
  }

  // Multer's own errors (from the file upload middleware) have a
  // `code` string, not a numeric MongoDB code — LIMIT_FILE_SIZE fires
  // when the 5MB cap from middleware/upload.js is exceeded.
  if (err.code === "LIMIT_FILE_SIZE") {
    statusCode = 400;
    message = ERROR_MESSAGES.POST.IMAGE_TOO_LARGE;
  }

  // Cloudinary's SDK rejects with a plain object rather than a real
  // Error instance in some failure modes, so err.message may be missing.
  if (err.http_code && !message) {
    statusCode = 500;
    message = ERROR_MESSAGES.POST.UPLOAD_FAILED;
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

module.exports = { notFound, errorHandler };
