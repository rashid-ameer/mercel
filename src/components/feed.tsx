import { InfiniteScroll } from "@/components";
import { CircularLoader, PostsLoadingSkeleton } from "@/components/loaders";
import { TPost } from "@/lib/types";
import { Post } from "@/components/posts";

interface FeedProps {
  onBottomReached: () => void;
  errMessage: string;
  data: TPost[];
  hasNextPage: boolean;
  status: "pending" | "success" | "error";
  noDataMessage: string;
  isFetchingNextPage: boolean;
  children: React.ReactNode;
}

function Feed({
  onBottomReached,
  errMessage,
  data,
  hasNextPage,
  status,
  noDataMessage,
  isFetchingNextPage,
  children,
}: FeedProps) {
  return (
    <>
      <InfiniteScroll className="space-y-5" onBottomReached={onBottomReached}>
        {status === "pending" && <PostsLoadingSkeleton />}
        {status === "error" && (
          <p className="text-center text-destructive">{errMessage}</p>
        )}
        {status === "success" && data.length === 0 && !hasNextPage && (
          <p className="text-center text-muted-foreground">{noDataMessage}</p>
        )}

        {children}

        {isFetchingNextPage && <CircularLoader />}
      </InfiniteScroll>
    </>
  );
}
export default Feed;
