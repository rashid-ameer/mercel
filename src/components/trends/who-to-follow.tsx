import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { FollowButton, UserAvatar, UserTooltip } from "@/components";
import { getUserDataSelect } from "@/lib/types";
import { Suspense } from "react";
import { FollowUsersSkeleton } from "../loaders";
import { getUsersToFollow } from "@/lib/server-utils";

async function WhoToFollow() {
  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <h2 className="text-lg font-semibold">Who To Follow</h2>

      <div className="space-y-2">
        <Suspense fallback={<FollowUsersSkeleton />}>
          <FollowUsers />
        </Suspense>
      </div>
    </div>
  );
}
export default WhoToFollow;

async function FollowUsers() {
  const { user } = await validateRequest();

  // user will already be redirected if it is not authorized
  if (!user) return null;

  const usersToFollow = await getUsersToFollow(user.id);

  return (
    <>
      {usersToFollow.length === 0 && (
        <p className="text-muted-foreground">No users to follow</p>
      )}

      {usersToFollow.map((user) => (
        <div key={user.id} className="flex items-center justify-between">
          <UserTooltip user={user}>
            <Link
              href={`/user/${user.username}`}
              className="flex items-center gap-3"
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

          <FollowButton
            userId={user.id}
            initialData={{
              followers: user._count.followers,
              isFollowedByUser: !!user.followers.length,
            }}
          />
        </div>
      ))}
    </>
  );
}
