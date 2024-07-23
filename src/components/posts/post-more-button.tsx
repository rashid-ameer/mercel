"use client";
import { useState } from "react";
import { DeletePostDialog } from "@/components/posts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash, Trash2 } from "lucide-react";

interface PostMoreButtonProps {
  postId: string;
  className?: string;
}

function PostMoreButton({ postId, className }: PostMoreButtonProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  return (
    <>
      {/* dialog for drop down menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className={className}>
            <MoreHorizontal className="size-5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="cursor-pointer text-destructive"
          >
            <Trash2 className="mr-2 size-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* dialog for deleting post */}
      <DeletePostDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        postId={postId}
      />
    </>
  );
}
export default PostMoreButton;
