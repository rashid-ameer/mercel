import { Button } from "@/components/ui/button";
import { SendHorizonal } from "lucide-react";
import { CircularLoader } from "@/components/loaders";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useCommentMutation } from "@/lib/react-query-utils";
import { TPost } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

interface CommentsProps {
  post: TPost;
}

function CommentInput({ post }: CommentsProps) {
  const [input, setInput] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  // comment mutation
  const commentMutation = useCommentMutation(post.id, post.userId);

  // handle comment submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    commentMutation.mutate(
      { post, content: input },
      {
        onSuccess: () => {
          setInput("");
          router.refresh();
        },
        onError: () => {
          toast({
            variant: "destructive",
            description: "An error occured while creating comment. Try again.",
          });
        },
      },
    );
  };

  return (
    <form className="flex items-center gap-2" onSubmit={handleSubmit}>
      <Input
        placeholder="Write a comment..."
        autoFocus
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <Button
        variant="ghost"
        disabled={commentMutation.isPending || !input.trim()}
        className="gap-2"
      >
        {
          <>
            {!commentMutation.isPending ? (
              <SendHorizonal className="size-5" />
            ) : (
              <CircularLoader className="size-5" />
            )}
            <span>Submit</span>
          </>
        }
      </Button>
    </form>
  );
}
export default CommentInput;
