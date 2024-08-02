import { z } from "zod";
import { loginSchema, signupSchema, updateUserProfileSchema } from "./schemas";
import { Prisma } from "@prisma/client";
export type { Media } from "@prisma/client";

export type Signup = z.infer<typeof signupSchema>;
export type Login = z.infer<typeof loginSchema>;

export const getUserDataSelect = (loggedInUserId: string) =>
  ({
    id: true,
    username: true,
    avatarUrl: true,
    displayName: true,
    bio: true,
    createdAt: true,
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
        posts: true,
        followers: true,
      },
    },
  }) satisfies Prisma.UserSelect;

export const getPostDataInclude = (loggedInUserId: string) =>
  ({
    user: {
      select: getUserDataSelect(loggedInUserId),
    },
    likes: {
      where: {
        userId: loggedInUserId,
      },
      select: {
        userId: true,
      },
    },
    bookmarks: {
      where: { userId: loggedInUserId },
      select: {
        userId: true,
      },
    },
    _count: {
      select: {
        likes: true,
        comments: true,
      },
    },
    attachments: true,
  }) satisfies Prisma.PostInclude;

export const getCommentDataInclude = (loggedInUserId: string) => {
  return {
    user: {
      select: getUserDataSelect(loggedInUserId),
    },
  } satisfies Prisma.CommentInclude;
};

// comment type
export type CommentData = Prisma.CommentGetPayload<{
  include: ReturnType<typeof getCommentDataInclude>;
}>;

// comment page
export type CommentPage = {
  comments: CommentData[];
  previousCursor: string | null;
};

// notifications include
export const notificationInclude = {
  issuer: {
    select: {
      username: true,
      displayName: true,
      avatarUrl: true,
    },
  },
  post: {
    select: {
      content: true,
    },
  },
} satisfies Prisma.NotificationInclude;

// notification type
export type NotificationData = Prisma.NotificationGetPayload<{
  include: typeof notificationInclude;
}>;

// notification page
export type NotificationPage = {
  notifications: NotificationData[];
  nextCursor: string | null;
};

// notification count
export type NotificationCountInfo = {
  unreadCount: number;
};

// Post type
export type TPost = Prisma.PostGetPayload<{
  include: ReturnType<typeof getPostDataInclude>;
}>;

// User data type
export type UserData = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserDataSelect>;
}>;

// Page Post
export type PagePost = {
  posts: TPost[];
  nextCursor: string | null;
};

// followers info
export type FollowersInfo = {
  isFollowedByUser: boolean;
  followers: number;
};
// likes info
export type LikesInfo = {
  isLikedByUser: boolean;
  likes: number;
};

// update user profile
export type UpdateUserProfile = z.infer<typeof updateUserProfileSchema>;

// attachment
export interface Attachment {
  file: File;
  mediaId?: string;
  isUploading: boolean;
}

// bookmark
export interface BookmarkInfo {
  isBookmarkedByUser: boolean;
}

// messages unread count
export interface MessagesCountInfo {
  unreadCount: number;
}
