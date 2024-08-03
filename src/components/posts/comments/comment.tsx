"use client";
import { CommentData } from "@/lib/types";
import UserTooltip from "../../user-tooltip";
import Link from "next/link";
import UserAvatar from "../../user-avatar";
import { getRelativeTime } from "@/lib/utils";
import useSession from "@/hooks/useSessionProvider";
import CommentMoreButton from "./comment-more-button";

interface CommentProps {
  comment: CommentData;
}

function Comment({ comment }: CommentProps) {
  const { user } = useSession();
  return (
    <div className="group/comment flex items-start gap-3 py-3 text-sm">
      <UserTooltip user={comment.user}>
        <Link href={`/users/${comment.user.username}`}>
          <UserAvatar avatarUrl={comment.user.avatarUrl} size={36} />
        </Link>
      </UserTooltip>

      <div className="flex-1">
        <div className="flex items-center gap-3">
          <UserTooltip user={comment.user}>
            <Link
              href={`/users/${comment.user.username}`}
              className="font-semibold hover:underline"
            >
              {comment.user.displayName}
            </Link>
          </UserTooltip>
          <span className="text-xs text-muted-foreground">
            {getRelativeTime(comment.createdAt)}
          </span>
        </div>
        <p>{comment.content}</p>
      </div>
      {user.id === comment.userId && (
        <CommentMoreButton
          comment={comment}
          className="opacity-0 transition-opacity duration-300 group-hover/comment:opacity-100"
        />
      )}
    </div>
  );
}
export default Comment;
