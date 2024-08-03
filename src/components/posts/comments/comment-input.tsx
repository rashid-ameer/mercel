import { Button } from "@/components/ui/button";
import { SendHorizonal } from "lucide-react";
import { CircularLoader } from "@/components/loaders";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useCommentMutation } from "@/lib/react-query-utils";
import { TPost } from "@/lib/types";

interface CommentsProps {
  post: TPost;
}

function CommentInput({ post }: CommentsProps) {
  const [input, setInput] = useState("");

  // comment mutation
  const commentMutation = useCommentMutation(post.id);

  // handle comment submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    commentMutation.mutate({ post, content: input });
    setInput("");
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
