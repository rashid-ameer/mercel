"use client";
import { Feed } from "@/components";
import { usePostsInfiniteQuery } from "@/lib/react-query-utils";
import Post from "./post";

function PostFeed() {
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, status } =
    usePostsInfiniteQuery("posts/for-you", ["post-feed", "for-you"]);

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
      errMessage="An error occured while fetching posts"
      noDataMessage="No posts to show. Try making posts."
      onBottomReached={handleBottomReached}
    >
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </Feed>
  );
}
export default PostFeed;
