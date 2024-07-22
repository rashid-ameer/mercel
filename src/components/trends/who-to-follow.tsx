import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { userDataSelect } from "@/lib/types";
import Link from "next/link";
import { Button } from "../ui/button";
import UserAvatar from "../user-avatar";

async function WhoToFollow() {
  const { user } = await validateRequest();

  // user will already be redirected if it is not authorized
  if (!user) return null;

  await new Promise((resolve) => setTimeout(resolve, 3000));

  const userToFollow = await prisma.user.findMany({
    where: {
      NOT: {
        id: user.id,
      },
    },
    select: userDataSelect,
    take: 5,
  });

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

            <Button className="rounded-full">Follow</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
export default WhoToFollow;
