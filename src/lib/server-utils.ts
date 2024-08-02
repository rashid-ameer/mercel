import { unstable_cache } from "next/cache";
import prisma from "./prisma";
import { cache } from "react";
import { notFound } from "next/navigation";
import { getPostDataInclude, getUserDataSelect } from "@/lib/types";
import streamServerClient from "./stream";

// get the top 5 trending topics
export const getTrendingTopics = unstable_cache(
  async () => {
    const result = await prisma.$queryRaw<{ hashtag: string; count: bigint }[]>`
            SELECT LOWER(unnest(regexp_matches(content, '#[[:alnum:]_]+', 'g'))) AS hashtag, COUNT(*) AS count
            FROM posts
            GROUP BY (hashtag)
            ORDER BY count DESC, hashtag ASC
            LIMIT 5
        `;

    return result.map((row) => ({
      hashtag: row.hashtag,
      count: Number(row.count),
    }));
  },
  ["trending_topics"],
  { revalidate: 3 * 60 * 60 },
);

// get the user details
export const getUserDetails = cache(
  async (username: string, userId: string) => {
    const user = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
      select: getUserDataSelect(userId),
    });

    if (!user) {
      notFound();
    }

    return user;
  },
);

// get the post
export const getPost = cache(async (postId: string, loggedInUserId: string) => {
  const post = await prisma.post.findFirst({
    where: {
      id: postId,
    },
    include: getPostDataInclude(loggedInUserId),
  });

  if (!post) {
    notFound();
  }

  return post;
});

// get the unread notification count from server
export const getUnreadNotificationCount = async (id: string) => {
  const unreadCount = await prisma.notification.count({
    where: {
      recipientId: id,
      read: false,
    },
  });

  return unreadCount;
};

// get the unread messages count from server
export const getUnreadMessagesCount = async (id: string) => {
  const { total_unread_count } = await streamServerClient.getUnreadCount(id);
  return total_unread_count;
};

// get followers information
export const getUsersToFollow = async (id: string) => {
  const userToFollow = await prisma.user.findMany({
    where: {
      NOT: {
        id: id,
      },
      followers: {
        none: {
          followerId: id,
        },
      },
    },
    select: getUserDataSelect(id),
    take: 5,
  });
  return userToFollow;
};
