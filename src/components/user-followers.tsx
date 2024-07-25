"use client";
import { useFollowInfoQuery } from "@/lib/react-query-utils";
import UserStats from "./user-stats";
import { FollowersInfo } from "@/lib/types";

interface UserFollowersProps {
  userId: string;
  initialData: FollowersInfo;
}

function UserFollowers({ userId, initialData }: UserFollowersProps) {
  const { data } = useFollowInfoQuery(userId, initialData);

  return <UserStats title="Followers" count={data.followers} />;
}
export default UserFollowers;
