import { validateRequest } from "@/auth";
import { FollowButton, Linkify, UserAvatar, UserTooltip } from "@/components";
import { CircularLoader, UserInfoSidebarSkeleton } from "@/components/loaders";
import { Post } from "@/components/posts";
import { getPost } from "@/lib/server-utils";
import { UserData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

interface PostPageProps {
  params: { postId: string };
}

export async function generateMetadata({
  params: { postId },
}: PostPageProps): Promise<Metadata> {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) {
    return {};
  }

  const post = await getPost(postId, loggedInUser.id);

  return {
    title: `${post.user.displayName} | ${post.content.slice(0, 50)}...`,
  };
}

async function PostPage({ params: { postId } }: PostPageProps) {
  const { user } = await validateRequest();

  // user will already be redirected to the login page if they are not logged in
  if (!user) return null;

  const post = await getPost(postId, user.id);

  return (
    <main className="flex flex-1 gap-5">
      <div className="flex-1">
        <Post post={post} />
      </div>
      <div className="sticky top-[8.25rem] hidden w-80 flex-none lg:block">
        <UserInfoSidebarWrapper user={post.user} />
      </div>
    </main>
  );
}
export default PostPage;

interface UserInfoSidebarProps {
  user: UserData;
  className?: string;
}

async function UserInfoSidebarWrapper({
  user,
  className,
}: UserInfoSidebarProps) {
  return (
    <div
      className={cn("space-y-5 rounded-2xl bg-card p-5 shadow-sm", className)}
    >
      <h2 className="text-xl font-bold">About this user</h2>

      <Suspense fallback={<UserInfoSidebarSkeleton />}>
        <UserInfoSidebar user={user} />
      </Suspense>
    </div>
  );
}

async function UserInfoSidebar({ user }: UserInfoSidebarProps) {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return null;

  return (
    <>
      <UserTooltip user={user}>
        <Link
          href={`/users/${user.username}}`}
          className="flex flex-wrap gap-x-3"
        >
          <UserAvatar avatarUrl={user.avatarUrl} />

          <div>
            <h3 className="line-clamp-1 break-all font-semibold hover:underline">
              {user.displayName}
            </h3>
            <p className="line-clamp-1 break-all text-muted-foreground">
              @{user.username}
            </p>
          </div>
        </Link>
      </UserTooltip>

      {user.bio && (
        <Linkify>
          <p className="line-clamp-6 whitespace-pre-line break-words text-muted-foreground">
            {user.bio}
          </p>
        </Linkify>
      )}

      {user.id !== loggedInUser.id && (
        <FollowButton
          userId={user.id}
          initialData={{
            followers: user._count.followers,
            isFollowedByUser: !!user.followers.length,
          }}
        />
      )}
    </>
  );
}
