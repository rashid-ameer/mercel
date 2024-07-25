import { unstable_cache } from "next/cache";
import prisma from "./prisma";
import { cache } from "react";
import { notFound } from "next/navigation";
import { getUserDataSelect } from "@/lib/types";

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
