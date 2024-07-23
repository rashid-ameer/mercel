import { type TPost } from "@/lib/types";
import Link from "next/link";
import UserAvatar from "../user-avatar";
import { getRelativeTime } from "@/lib/utils";

interface PostProps {
  post: TPost;
}

function Post({ post }: PostProps) {
  return (
    <article className="space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex gap-3">
        <Link href={`/posts/${post.user.username}`}>
          <UserAvatar avatarUrl={post.user.avatarUrl} />
        </Link>

        <div className="flex flex-col">
          <Link
            href={`/posts/${post.user.username}`}
            className="font-medium hover:underline"
          >
            {post.user.displayName}
          </Link>

          <Link
            href={`/posts/${post.id}`}
            className="text-sm text-muted-foreground hover:underline"
          >
            {/* {getRelativeTime(post.createdAt)} */}
          </Link>
        </div>
      </div>

      <div className="whitespace-pre-wrap break-words">{post.content}</div>
    </article>
  );
}
export default Post;
