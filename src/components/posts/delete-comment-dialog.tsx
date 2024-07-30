import { useDeleteCommentMutation } from "@/lib/react-query-utils";
import { CommentData } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoadingButton } from "../auth";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "../ui/button";

interface DeleteCommentDialogProps {
  comment: CommentData;
  open: boolean;
  onClose: () => void;
}

function DeleteCommentDialog({
  comment,
  open,
  onClose,
}: DeleteCommentDialogProps) {
  const { toast } = useToast();

  // delete comment mutation
  const deleteCommentMutation = useDeleteCommentMutation();

  // handle delete comment
  const handleDeleteComment = () => {
    deleteCommentMutation.mutate(comment.id, {
      onSuccess: () => {
        toast({ description: "Comment deleted successfully" });
        onClose();
      },
      onError: () => {
        toast({
          variant: "destructive",
          description: "An error occured while deleting comment",
        });
      },
    });
  };
  // handle open change
  const handleOpenChange = (open: boolean) => {
    console.log(open);

    if (deleteCommentMutation.isPending || open) return;

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete comment</DialogTitle>

          <DialogDescription>
            Are you sure you want to delete this comment? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton
            loading={deleteCommentMutation.isPending}
            variant="destructive"
            onClick={handleDeleteComment}
          >
            Delete
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default DeleteCommentDialog;
