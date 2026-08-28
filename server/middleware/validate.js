// A "middleware factory" — a function that RETURNS a middleware function,
// pre-configured for whichever Zod schema you pass in.
//
// Usage: router.post("/register", validate(registerSchema), registerUser);
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const messages = result.error.issues.map((issue) => issue.message);
    res.status(400);
    return next(new Error(messages.join(", ")));
  }

  req.body = result.data;
  next();
};

module.exports = validate;
