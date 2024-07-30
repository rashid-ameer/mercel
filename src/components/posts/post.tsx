"use client";
import { Media, type TPost } from "@/lib/types";
import Link from "next/link";
import UserAvatar from "../user-avatar";
import { cn, getRelativeTime } from "@/lib/utils";
import { PostMoreButton } from "@/components/posts";
import useSession from "@/hooks/useSessionProvider";
import { Linkify, UserTooltip } from "@/components";
import Image from "next/image";
import LikeButton from "./like-button";
import BookmarkButton from "./bookmark-button";
import { useState } from "react";
import CommentButton from "./comment-button";
import Comments from "./comments";

interface PostProps {
  post: TPost;
}

function Post({ post }: PostProps) {
  const { user } = useSession();
  // comments state
  const [showComments, setShowComments] = useState(false);

  return (
    <article className="group/post space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-3">
          <UserTooltip user={post.user}>
            <Link href={`/posts/${post.user.username}`}>
              <UserAvatar avatarUrl={post.user.avatarUrl} />
            </Link>
          </UserTooltip>

          <div className="flex flex-col">
            <Link
              href={`/user/${post.user.username}`}
              className="font-medium hover:underline"
            >
              {post.user.displayName}
            </Link>

            <Link
              href={`/posts/${post.id}`}
              className="text-sm text-muted-foreground hover:underline"
            >
              {getRelativeTime(post.createdAt)}
            </Link>
          </div>
        </div>
        {post.user.id === user.id && (
          <PostMoreButton
            className="opacity-0 transition-opacity group-hover/post:opacity-100"
            postId={post.id}
          />
        )}
      </div>

      <Linkify>
        <div className="whitespace-pre-wrap break-words">{post.content}</div>
      </Linkify>

      {!!post.attachments.length && (
        <MediaPreviews attachments={post.attachments} />
      )}

      <hr className="text-muted-foreground" />
      <div className="flex items-center gap-5">
        <LikeButton
          initialData={{
            isLikedByUser: !!post.likes.length,
            likes: post._count.likes,
          }}
          postId={post.id}
        />

        <CommentButton
          post={post}
          onClick={() => setShowComments(!showComments)}
        />

        <BookmarkButton
          className="ml-auto"
          postId={post.id}
          initialData={{
            isBookmarkedByUser: post.bookmarks.some(
              (bookmark) => bookmark.userId === user.id,
            ),
          }}
        />
      </div>

      {showComments && <Comments post={post} />}
    </article>
  );
}
export default Post;

interface MediaPreviewsProps {
  attachments: Media[];
}

function MediaPreviews({ attachments }: MediaPreviewsProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-3",
        attachments.length > 1 && "sm:grid sm:grid-cols-2",
      )}
    >
      {attachments.map((attachment) => (
        <MediaPreview key={attachment.id} attachment={attachment} />
      ))}
    </div>
  );
}

interface MediaPreviewProps {
  attachment: Media;
}

function MediaPreview({ attachment: { id, url, type } }: MediaPreviewProps) {
  if (type === "IMAGE") {
    return (
      <Image
        src={url}
        alt=""
        width={500}
        height={500}
        className="max-h-[30rem] w-auto rounded-2xl object-cover"
      />
    );
  }

  return (
    <div className="w-full">
      <video
        src={url}
        controls
        className="max-h-[30rem] w-full rounded-2xl object-cover"
      />
    </div>
  );
}
