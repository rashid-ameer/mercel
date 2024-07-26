import { type TPost } from "@/lib/types";
import Link from "next/link";
import UserAvatar from "../user-avatar";
import { getRelativeTime } from "@/lib/utils";
import { PostMoreButton } from "@/components/posts";
import useSession from "@/hooks/useSessionProvider";
import { Linkify, UserTooltip } from "@/components";

interface PostProps {
  post: TPost;
}

function Post({ post }: PostProps) {
  const { user } = useSession();

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
    </article>
  );
}
export default Post;
