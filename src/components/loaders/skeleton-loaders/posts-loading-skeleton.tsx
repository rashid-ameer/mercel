import PostLoadingSkeleton from "./post-loading-seleton";

function PostsLoadingSkeleton() {
  return (
    <div className="space-y-5">
      <PostLoadingSkeleton />
      <PostLoadingSkeleton />
      <PostLoadingSkeleton />
    </div>
  );
}
export default PostsLoadingSkeleton;
