"use client";
import { Feed } from "@/components";
import Post from "./post";
import { usePostsInfiniteQuery } from "@/lib/react-query-utils";

interface PostFeedProps {
  userId: string;
}

function UserFeed({ userId }: PostFeedProps) {
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, status } =
    usePostsInfiniteQuery(`users/${userId}/posts`, [
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
    <Feed
      data={posts}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      status={status}
      errMessage="An error occured while fetching posts"
      noDataMessage="No posts found"
      onBottomReached={handleBottomReached}
    >
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </Feed>
  );
}
export default UserFeed;
