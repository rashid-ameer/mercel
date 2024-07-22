import { z } from "zod";
import { loginSchema, signupSchema } from "./schemas";
import { Prisma } from "@prisma/client";

export type Signup = z.infer<typeof signupSchema>;
export type Login = z.infer<typeof loginSchema>;

export const postDataInclude = {
  user: {
    select: {
      username: true,
      avatarUrl: true,
      displayName: true,
    },
  },
} satisfies Prisma.PostInclude;

export type TPost = Prisma.PostGetPayload<{ include: typeof postDataInclude }>;
