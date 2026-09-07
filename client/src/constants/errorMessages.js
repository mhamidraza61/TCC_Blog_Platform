// Mirrors server/constants/errorMessages.js — kept as a separate frozen
// object here because the frontend and backend are two different
// JavaScript runtimes that can't literally share one file. Duplicating
// just the VALIDATION messages (not the whole backend file) keeps the
// two in sync for anything the user actually sees while typing, while
// everything else (server-only errors) has no reason to exist here.
//
// Object.freeze() protects this object from being mutated at runtime by
// any code running in this app, the same reasoning as the backend
// version — it doesn't "hide" anything from a user with devtools open
// (nothing client-side ever could), it just guarantees every component
// that imports this sees the same untampered values for as long as the
// page is loaded.
const ERROR_MESSAGES = Object.freeze({
  VALIDATION: Object.freeze({
    NAME_MIN_LENGTH: "Name must be at least 2 characters",
    INVALID_EMAIL: "Enter a valid email address",
    PASSWORD_MIN_LENGTH: "Password must be at least 6 characters",
    PASSWORD_REQUIRED: "Password is required",
    TITLE_REQUIRED: "Title is required",
    CONTENT_REQUIRED: "Content is required",
  }),
});

export default ERROR_MESSAGES;
