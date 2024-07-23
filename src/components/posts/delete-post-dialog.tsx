import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeletePostMutation } from "@/lib/react-query-utils";
import { LoadingButton } from "@/components/auth";
import { Button } from "@/components/ui/button";
import { useToast } from "../ui/use-toast";

interface DeletePostDialogProps {
  open: boolean;
  onClose: () => void;
  postId: string;
}

function DeletePostDialog({ open, onClose, postId }: DeletePostDialogProps) {
  const deleteMutation = useDeletePostMutation();
  const { toast } = useToast();

  // handle open change
  const handleOpenChange = async (open: boolean) => {
    if (!open || !deleteMutation.isPending) {
      onClose();
    }
  };

  // handle delete
  const handleDelete = () => {
    deleteMutation.mutate(postId, {
      onSuccess: () => {
        toast({ description: "Post deleted successfully" });
        onClose();
      },
      onError: (error) => {
        toast({ variant: "destructive", description: "Failed to delete post" });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Post?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this post? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            loading={deleteMutation.isPending}
            variant="destructive"
            onClick={handleDelete}
          >
            Delete
          </LoadingButton>

          <Button
            variant="outline"
            onClick={onClose}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default DeletePostDialog;
