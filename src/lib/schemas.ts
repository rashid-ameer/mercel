import { z } from "zod";

const requiredString = (msg: string) => z.string().trim().min(1, msg);

export const signupSchema = z.object({
  email: requiredString("Email is required").email("Invalid email address"),
  username: requiredString("Username is required").regex(
    /^[a-zA-Z0-9_-]*$/,
    "Username can only contain letters, numbers, underscores, and hyphens",
  ),
  password: requiredString("Password is required").min(
    8,
    "Password must be at least 8 characters",
  ),
});

export const loginSchema = z.object({
  username: requiredString("Username is required"),
  password: requiredString("Password is required"),
});
