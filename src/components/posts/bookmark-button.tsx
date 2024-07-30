import { useBookmarkMutation, useBookmarkQuery } from "@/lib/react-query-utils";
import { BookmarkInfo } from "@/lib/types";
import { QueryKey } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  initialData: BookmarkInfo;
  postId: string;
  className?: string;
}

function BookmarkButton({
  initialData,
  postId,
  className,
}: BookmarkButtonProps) {
  const { toast } = useToast();
  const queryKey: QueryKey = ["bookmarks-info", postId];

  const { data } = useBookmarkQuery(postId, initialData, queryKey);
  const bookmarksMutation = useBookmarkMutation(queryKey);

  // handle bookmark
  const handleBookmark = () => {
    // optimistic update
    toast({
      description: `${data.isBookmarkedByUser ? "Unbookmarked" : "Bookmarked"} post successfully.`,
    });
    // make request
    bookmarksMutation.mutate(
      {
        isBookmarkedByUser: data.isBookmarkedByUser,
        postId,
      },
      {
        onError: (err, variables, context) => {
          toast({
            variant: "destructive",
            description: `Couldn't ${data.isBookmarkedByUser ? "unbookmark" : "bookmark"} post. Please try again.`,
          });
        },
      },
    );
  };

  return (
    <button className={cn("flex items-center gap-2", className)}>
      <Bookmark
        onClick={handleBookmark}
        className={cn("size-5", {
          "fill-primary text-primary": data.isBookmarkedByUser,
        })}
      />
    </button>
  );
}
export default BookmarkButton;
