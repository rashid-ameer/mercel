"use client";
import { InfiniteScroll } from "@/components";
import Post from "./post";
import { CircularLoader, PostsLoadingSkeleton } from "@/components/loaders";
import { usePostsInfiniteQuery } from "@/lib/react-query-utils";

function PostFeed() {
  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    status,
    error,
  } = usePostsInfiniteQuery();

  const handleBottomReached = () => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  };

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  return (
    <>
      <InfiniteScroll
        className="mt-5 space-y-5"
        onBottomReached={handleBottomReached}
      >
        {status === "pending" && <PostsLoadingSkeleton />}
        {status === "error" && (
          <p className="text-center text-destructive">{error.message}</p>
        )}
        {status === "success" && posts.length === 0 && !hasNextPage && (
          <p className="text-center text-muted-foreground">No posts to show</p>
        )}

        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}

        {isFetchingNextPage && <CircularLoader />}
      </InfiniteScroll>
    </>
  );
}
export default PostFeed;
