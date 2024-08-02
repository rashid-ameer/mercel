import { getTrendingTopics } from "@/lib/server-utils";
import { getFormattedNumber } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import { TrendsTopicSkeleton } from "@/components/loaders";

async function TrendingTopics() {
  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <h2 className="text-lg font-semibold">Trending Topics</h2>

      <div className="space-y-2">
        <Suspense fallback={<TrendsTopicSkeleton />}>
          <TrendTopicList />
        </Suspense>
      </div>
    </div>
  );
}
export default TrendingTopics;

async function TrendTopicList() {
  const trendingTopics = await getTrendingTopics();

  return (
    <>
      {trendingTopics.length === 0 && (
        <p className="text-muted-foreground">No trending topic found.</p>
      )}

      {trendingTopics.map(({ hashtag, count }) => {
        const title = hashtag.replace("#", "");
        return (
          <Link key={title} href={`/hashtag/${title}`} className="block">
            <p
              className="line-clamp-1 break-all font-semibold hover:underline"
              title={hashtag}
            >
              {hashtag}
            </p>
            <p className="text-sm text-muted-foreground">
              {getFormattedNumber(count)} {count === 1 ? "Post" : "Posts"}
            </p>
          </Link>
        );
      })}
    </>
  );
}
