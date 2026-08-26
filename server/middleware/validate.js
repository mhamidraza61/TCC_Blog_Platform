// A "middleware factory" — a function that RETURNS a middleware function,
// pre-configured for whichever Zod schema you pass in. This lets one
// piece of code validate every route's body instead of repeating
// try/catch parsing logic in every controller.
//
// Usage: router.post("/register", validate(registerSchema), registerUser);
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const messages = result.error.issues.map((issue) => issue.message);
    res.status(400);
    return next(new Error(messages.join(", ")));
  }

  // Overwrite req.body with the parsed/trimmed data (e.g. trimmed strings)
  req.body = result.data;
  next();
};

module.exports = validate;
