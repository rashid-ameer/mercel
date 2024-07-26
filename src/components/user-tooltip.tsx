"use client";
import { FollowersInfo, UserData } from "@/lib/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useSession from "@/hooks/useSessionProvider";
import { FollowButton, Linkify, UserAvatar, UserFollowers } from "@/components";
import Link from "next/link";

interface UserTooltipProps {
  children: React.ReactNode;
  user: UserData;
}

function UserTooltip({ children, user }: UserTooltipProps) {
  const { user: loggedInUser } = useSession();

  const followerInfo: FollowersInfo = {
    isFollowedByUser: !!user.followers.length,
    followers: user._count.followers,
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>

        <TooltipContent>
          <div className="max-w-80 space-y-3 px-1 py-2.5 md:min-w-48">
            <div className="flex items-center justify-between gap-3">
              <Link href={`/users/${user.username}`}>
                <UserAvatar avatarUrl={user.avatarUrl} size={70} />
              </Link>

              {loggedInUser.id !== user.id && (
                <FollowButton initialData={followerInfo} userId={user.id} />
              )}
            </div>

            <Link href={`/users/${user.username}`} className="block">
              <p className="text-lg font-semibold hover:underline">
                {user.displayName}
              </p>
              <p className="text-muted-foreground">@{user.displayName}</p>
            </Link>

            {user.bio && (
              <Linkify>
                <p className="line-clamp-4 whitespace-pre-line break-words">
                  {user.bio}
                </p>
              </Linkify>
            )}

            <UserFollowers userId={user.id} initialData={followerInfo} />
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
export default UserTooltip;
