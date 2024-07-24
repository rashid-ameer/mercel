import { z } from "zod";
import { loginSchema, signupSchema } from "./schemas";
import { Prisma } from "@prisma/client";

export type Signup = z.infer<typeof signupSchema>;
export type Login = z.infer<typeof loginSchema>;

export const getUserDataSelect = (loggedInUserId: string) =>
  ({
    id: true,
    username: true,
    avatarUrl: true,
    displayName: true,
    followers: {
      where: {
        followerId: loggedInUserId,
      },
      select: {
        followerId: true,
      },
    },
    _count: {
      select: {
        followers: true,
      },
    },
  }) satisfies Prisma.UserSelect;

export const getPostDataInclude = (loggedInUserId: string) =>
  ({
    user: {
      select: getUserDataSelect(loggedInUserId),
    },
  }) satisfies Prisma.PostInclude;

export type TPost = Prisma.PostGetPayload<{
  include: ReturnType<typeof getPostDataInclude>;
}>;

export type PagePost = {
  posts: TPost[];
  nextCursor: string | null;
};

export type FollowersInfo = {
  isFollowedByUser: boolean;
  followers: number;
};
