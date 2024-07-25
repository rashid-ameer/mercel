import {
  FollowButton,
  UserAvatar,
  UserFollowers,
  UserStats,
} from "@/components";
import { FollowersInfo, UserData } from "@/lib/types";
import { formatDate } from "date-fns";
import { Button } from "./ui/button";

interface UserProfileProps {
  user: UserData;
  loggedInUserId: string;
}

function UserProfile({ user, loggedInUserId }: UserProfileProps) {
  const followerInfo: FollowersInfo = {
    isFollowedByUser: !!user.followers.length,
    followers: user._count.followers,
  };

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <UserAvatar
        className="mx-auto size-full max-h-[250px] max-w-[250px]"
        size={250}
        priority={true}
      />

      <div className="flex flex-wrap justify-between sm:flex-nowrap">
        <div className="space-y-3">
          <div>
            <h1 className="text-2xl font-bold">{user.displayName}</h1>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>

          <p className="">
            Member since {formatDate(user.createdAt, "MMM d, yyyy")}
          </p>

          <div className="flex gap-3">
            <UserStats title="Posts" count={user._count.posts} />
            <UserFollowers userId={user.id} initialData={followerInfo} />
          </div>
        </div>
        {loggedInUserId === user.id ? (
          <Button className="rounded-full" variant="secondary">
            Edit
          </Button>
        ) : (
          <FollowButton initialData={followerInfo} userId={user.id} />
        )}
      </div>

      {user.bio && (
        <>
          <hr />
          <p className="text-muted-foreground">{user.bio}</p>
        </>
      )}
    </div>
  );
}
export default UserProfile;
