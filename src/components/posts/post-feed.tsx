"use client";
import { InfiniteScroll } from "@/components";
import { PagePost } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import Post from "./post";
import kyInstance from "@/lib/ky";
import { CircularLoader, PostsLoadingSkeleton } from "@/components/loaders";

function PostFeed() {
  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "for-you"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "/api/posts/for-you",
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<PagePost>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

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
