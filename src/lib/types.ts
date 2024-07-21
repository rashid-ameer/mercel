import { z } from "zod";
import { loginSchema, signupSchema } from "./schemas";

export type Signup = z.infer<typeof signupSchema>;
export type Login = z.infer<typeof loginSchema>;
