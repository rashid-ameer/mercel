"use client";
import { Feed } from "@/components";
import { usePostsInfiniteQuery } from "@/lib/react-query-utils";
import { Post } from "@/components/posts";

function BookmarkFeed() {
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, status } =
    usePostsInfiniteQuery("posts/bookmarked", ["post-feed", "bookmarks"]);

  const handleBottomReached = () => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  };

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  return (
    <Feed
      data={posts}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      status={status}
      errMessage="An error occured while fetching bookmarked posts"
      noDataMessage="No bookmarked posts found"
      onBottomReached={handleBottomReached}
    >
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </Feed>
  );
}
export default BookmarkFeed;
