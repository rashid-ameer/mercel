import kyInstance from "@/lib/ky";
import { useLikesMutation, useLikesQuery } from "@/lib/react-query-utils";
import { LikesInfo } from "@/lib/types";
import { QueryKey, useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  initialData: LikesInfo;
  postId: string;
}

function LikeButton({ initialData, postId }: LikeButtonProps) {
  const { toast } = useToast();

  const queryKey: QueryKey = ["likes-info", postId];
  const { data } = useLikesQuery(postId, initialData, queryKey);
  const likesMutation = useLikesMutation(queryKey);

  // handle like/unlike
  const handleLike = () => {
    likesMutation.mutate(
      {
        isLikedByUser: data.isLikedByUser,
        postId: postId,
      },
      {
        onError: () => {
          toast({
            variant: "destructive",
            description: `Couldn't ${data.isLikedByUser ? "unlike" : "like"} the post. Try again later.`,
          });
        },
      },
    );
  };

  return (
    <button className="flex items-center gap-2" onClick={handleLike}>
      <Heart
        className={cn("size-5", {
          "fill-red-500 text-red-500": data.isLikedByUser,
        })}
      />

      <span className="text-sm font-medium tabular-nums">
        {data.likes} <span className="hidden sm:inline">likes</span>
      </span>
    </button>
  );
}
export default LikeButton;
