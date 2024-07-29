"use client";
import { InfiniteScroll } from "@/components";
import { CircularLoader, PostsLoadingSkeleton } from "@/components/loaders";
import { usePostsInfiniteQuery } from "@/lib/react-query-utils";
import { Post } from "./posts";

function BookmarkFeed() {
  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    status,
    error,
  } = usePostsInfiniteQuery("posts/bookmarked", ["post-feed", "bookmarks"]);

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
            You have not bookmarked anything yet.
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
export default BookmarkFeed;
