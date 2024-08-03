import { CommentData } from "@/lib/types";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2 } from "lucide-react";
import DeleteCommentDialog from "./delete-comment-dialog";

interface CommentMoreButtonProps {
  comment: CommentData;
  className?: string;
}

function CommentMoreButton({ comment, className }: CommentMoreButtonProps) {
  const [showDeleteCommentDialog, setShowDeleteCommentDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className={className}>
            <MoreHorizontal className="size-5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => setShowDeleteCommentDialog(true)}
            className="cursor-pointer text-destructive"
          >
            <Trash2 className="mr-2 size-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteCommentDialog
        comment={comment}
        open={showDeleteCommentDialog}
        onClose={() => setShowDeleteCommentDialog(false)}
      />
    </>
  );
}
export default CommentMoreButton;
