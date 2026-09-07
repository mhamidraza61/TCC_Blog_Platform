import { z } from "zod";
import ERROR_MESSAGES from "../constants/errorMessages";

// Mirrors server/models/Post.js — title and content required, tags optional.
export const postSchema = z.object({
  title: z.string().trim().min(1, ERROR_MESSAGES.VALIDATION.TITLE_REQUIRED),
  content: z.string().trim().min(1, ERROR_MESSAGES.VALIDATION.CONTENT_REQUIRED),
  // The form collects tags as one comma-separated string (easier to type
  // than an array input) and this schema transforms it into a real array
  // right here, so the rest of the app only ever deals with a string[].
  tags: z
    .string()
    .optional()
    .transform((val) =>
      val
        ? val.split(",").map((tag) => tag.trim()).filter(Boolean)
        : []
    ),
});
