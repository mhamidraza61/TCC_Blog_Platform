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

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

module.exports = { notFound, errorHandler };
