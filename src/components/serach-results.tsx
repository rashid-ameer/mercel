"use client";
import { InfiniteScroll } from "@/components";
import { CircularLoader, PostsLoadingSkeleton } from "@/components/loaders";
import {
  usePostsInfiniteQuery,
  useSearchInfiniteQuery,
} from "@/lib/react-query-utils";
import { Post } from "./posts";

interface SearchResultsProps {
  q: string;
}

function SearchResults({ q }: SearchResultsProps) {
  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    status,
    error,
  } = useSearchInfiniteQuery(q);

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
          <p className="text-center text-destructive">
            Error occured while searching
          </p>
        )}
        {status === "success" && posts.length === 0 && !hasNextPage && (
          <p className="text-center text-muted-foreground">
            No results found for &quot;{q}&quot;
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
export default SearchResults;
