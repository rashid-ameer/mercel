import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { FollowButton, UserAvatar } from "@/components";
import { getUserDataSelect } from "@/lib/types";

async function WhoToFollow() {
  const { user } = await validateRequest();

  // user will already be redirected if it is not authorized
  if (!user) return null;

  const userToFollow = await prisma.user.findMany({
    where: {
      NOT: {
        id: user.id,
      },
      followers: {
        none: {
          followerId: user.id,
        },
      },
    },
    select: getUserDataSelect(user.id),
    take: 5,
  });

  console.log(userToFollow);

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <h2 className="text-lg font-semibold">Who To Follow</h2>

      <div className="space-y-2">
        {userToFollow.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
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

            <FollowButton
              userId={user.id}
              initialData={{
                followers: user._count.followers,
                isFollowedByUser: !!user.followers.length,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
export default WhoToFollow;
