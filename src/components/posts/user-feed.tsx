"use client";
import { InfiniteScroll } from "@/components";
import Post from "./post";
import { CircularLoader, PostsLoadingSkeleton } from "@/components/loaders";
import { usePostsInfiniteQuery } from "@/lib/react-query-utils";

interface PostFeedProps {
  userId: string;
}

function UserFeed({ userId }: PostFeedProps) {
  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    status,
    error,
  } = usePostsInfiniteQuery(`users/${userId}/posts`, [
    "post-feed",
    "user-posts",
    userId,
  ]);

  const handleBottomReached = () => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  };

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  return (
    <>
      <InfiniteScroll
        className="space-y-5"
        onBottomReached={handleBottomReached}
      >
        {status === "pending" && <PostsLoadingSkeleton />}
        {status === "error" && (
          <p className="text-center text-destructive">{error.message}</p>
        )}
        {status === "success" && posts.length === 0 && !hasNextPage && (
          <p className="text-center text-muted-foreground">
            This user has not posted yet.
          </p>
        )}

        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}

        {isFetchingNextPage && <CircularLoader />}
      </InfiniteScroll>
    </>
  );
}
export default UserFeed;
