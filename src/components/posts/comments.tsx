import { useCommentsInfiniteQuery } from "@/lib/react-query-utils";
import { TPost } from "@/lib/types";

import CommentInput from "./comment-input";
import Comment from "./comment";
import { Button } from "../ui/button";
import { CircularLoader } from "../loaders";

interface CommentsProps {
  post: TPost;
}

function Comments({ post }: CommentsProps) {
  // comments infinite query
  const { data, isFetching, hasNextPage, fetchNextPage, status } =
    useCommentsInfiniteQuery(post.id);

  const comments = data?.pages.flatMap((page) => page.comments);
  return (
    <div className="space-y-3">
      <CommentInput post={post} />

      {status === "pending" && <CircularLoader />}
      {status === "error" && (
        <p className="text-center text-destructive">
          An error occured while loading comments.
        </p>
      )}
      {status === "success" && !comments?.length && (
        <p className="text-center text-muted-foreground">
          No comment has been made yet.
        </p>
      )}

      {hasNextPage && (
        <Button
          variant="link"
          className="mx-auto flex gap-2"
          disabled={isFetching}
          onClick={() => fetchNextPage()}
        >
          {isFetching && <CircularLoader className="size-4" />}
          <span>Load previous comments</span>
        </Button>
      )}

      <div className="divide-y">
        {comments?.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
export default Comments;
