// Central place for every user-facing error message in the API.
//
// Object.freeze() makes this object IMMUTABLE at runtime — if any code
// anywhere (a bug, a bad merge, a malicious dependency) tries to do
// something like ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS = "hacked",
// JavaScript silently ignores it in normal mode, and throws a TypeError
// in strict mode ("use strict" / ES modules). Either way, the message
// can never actually be changed after this file loads — including from
// "the client side," since the client never has access to this file at
// all (it only ever sees the string in the JSON response, not this
// object). Freezing here is really about protecting the SERVER's own
// code from accidentally mutating a shared object at runtime, since
// every controller imports and reads from the same single instance.
//
// Note: freeze is shallow — it only locks the top-level keys. Since
// every value here is a plain string (immutable in JS anyway), that's
// not a concern in this file. If a nested object were added later,
// it would need its own Object.freeze() too.

const ERROR_MESSAGES = Object.freeze({
  AUTH: Object.freeze({
    EMAIL_EXISTS: "A user with this email already exists",
    INVALID_CREDENTIALS: "Invalid email or password",
    NO_TOKEN: "Not authorized, no token provided",
    TOKEN_FAILED: "Not authorized, token failed",
    USER_NOT_FOUND_FOR_TOKEN: "User belonging to this token no longer exists",
  }),

  USER: Object.freeze({
    NOT_FOUND: "User not found",
  }),

  POST: Object.freeze({
    NOT_FOUND: "Post not found",
    NOT_AUTHOR: "Not authorized — you are not the author of this post",
  }),

  GENERIC: Object.freeze({
    ROUTE_NOT_FOUND: (path) => `Route not found - ${path}`,
    RESOURCE_NOT_FOUND: "Resource not found",
    DUPLICATE_FIELD: (field) => `Duplicate value entered for field: ${field}`,
    RATE_LIMITED: "Too many attempts, please try again later",
  }),
});

module.exports = ERROR_MESSAGES;
