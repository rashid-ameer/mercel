"use client";
import { Button } from "@/components/ui/button";
import { UserData } from "@/lib/types";
import { useState } from "react";
import { EditProfileDialog } from "@/components";

interface EditProfileButtonProps {
  user: UserData;
}

function EditProfileButton({ user }: EditProfileButtonProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);

  // handler
  const onClose = () => {
    setShowEditDialog(false);
  };

  return (
    <>
      <Button variant="outline" onClick={() => setShowEditDialog(true)}>
        Edit Profile
      </Button>
      <EditProfileDialog open={showEditDialog} onClose={onClose} user={user} />
    </>
  );
}
export default EditProfileButton;
