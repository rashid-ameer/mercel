"use client";
import { FollowersInfo } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useFollowInfoQuery, useFollowMutation } from "@/lib/react-query-utils";
import { useToast } from "@/components/ui/use-toast";

interface FollowButtonProps {
  userId: string;
  initialData: FollowersInfo;
}

function FollowButton({ userId, initialData }: FollowButtonProps) {
  const { toast } = useToast();

  // user follow query
  const { data } = useFollowInfoQuery(userId, initialData);

  // mutation for follow/unfollow
  const followMutation = useFollowMutation(userId, data.isFollowedByUser);

  // handle click
  const handleClick = () => {
    followMutation.mutate(undefined, {
      onError: () => {
        toast({
          variant: "destructive",
          description: `Failed to ${data.isFollowedByUser ? "Unfollow" : "Follow"}. Try again.`,
        });
      },
    });
  };

  return (
    <Button
      className="rounded-full"
      variant={data.isFollowedByUser ? "secondary" : "default"}
      onClick={handleClick}
    >
      {data.isFollowedByUser ? "Unfollow" : "Follow"}
    </Button>
  );
}
export default FollowButton;
