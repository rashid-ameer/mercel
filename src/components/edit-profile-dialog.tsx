"use client";
import { UpdateUserProfile, UserData } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserProfileSchema } from "@/lib/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoadingButton } from "@/components/auth";
import { useUserUpdateProfileMutation } from "@/lib/react-query-utils";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import Image, { StaticImageData } from "next/image";
import { useRef, useState } from "react";
import placholderImage from "@/assets/avatar-placeholder.png";
import { Label } from "@radix-ui/react-label";
import { Camera } from "lucide-react";
import { CropImageDialog } from "@/components";
import Resizer from "react-image-file-resizer";

interface EditProfileDialogProps {
  user: UserData;
  open: boolean;
  onClose: () => void;
}

function EditProfileDialog({ user, open, onClose }: EditProfileDialogProps) {
  const { toast } = useToast();
  const router = useRouter();
  // image crop state
  const [croppedImage, setCroppedImage] = useState<Blob | null>(null);

  // form
  const form = useForm<UpdateUserProfile>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      displayName: user.displayName,
      bio: user.bio || "",
    },
  });

  // mutation
  const updateProfileMutation = useUserUpdateProfileMutation();

  // submit handler
  const onSubmit = (values: UpdateUserProfile) => {
    const avatarFile = croppedImage
      ? new File([croppedImage], `avatar_${user.id}.webp`)
      : undefined;
    // implement submit logic here
    updateProfileMutation.mutate(
      {
        profileData: values,
        avatar: avatarFile,
      },
      {
        onSuccess: () => {
          setCroppedImage(null);
          router.refresh();

          toast({ description: "Profile updated successfully" });
          onOpenChange();
        },
        onError: (error) => {
          toast({
            description: "Cannot update profile. Please try again",
            variant: "destructive",
          });
        },
      },
    );
  };

  // onOpenChange handler
  const onOpenChange = () => {
    if (!open || updateProfileMutation.isPending) {
      return;
    }

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        {/* Image Dialog */}
        <div className="spacy-y-1.5">
          <Label>Avatar</Label>
          <AvatarInput
            onImageCropped={setCroppedImage}
            src={
              croppedImage
                ? URL.createObjectURL(croppedImage)
                : user.avatarUrl || placholderImage
            }
          />
        </div>

        {/* form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            {/* input field for display name */}
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input placeholder="john" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* textarea for bio */}
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a lit bit about yourself."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <LoadingButton
                type="submit"
                loading={updateProfileMutation.isPending}
                className=""
              >
                Save
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
export default EditProfileDialog;

interface AvatarInputProps {
  src: string | StaticImageData;
  onImageCropped: (blob: Blob | null) => void;
}

function AvatarInput({ src, onImageCropped }: AvatarInputProps) {
  const [imageToCrop, setImageToCrop] = useState<File>();

  // ref to file input element
  const fileInputref = useRef<HTMLInputElement>(null);

  // on image selected
  const onImageSelected = (image: File | undefined) => {
    if (!image) return;
    // furthur implement logic
    Resizer.imageFileResizer(
      image,
      1024,
      1024,
      "WEBP",
      100,
      0,
      (uri) => setImageToCrop(uri as File),
      "file",
    );
  };

  return (
    <>
      <input
        className="sr-only hidden"
        ref={fileInputref}
        type="file"
        accept="image/*"
        onChange={(e) => onImageSelected(e.target.files?.[0])}
      />

      <button
        onClick={() => fileInputref.current?.click()}
        className="group/avatar relative flex"
      >
        <Image
          src={src}
          alt="avatar"
          width={150}
          height={150}
          className="size-36 flex-none rounded-full object-cover"
        />

        <span className="absolute inset-0 m-auto flex size-12 items-center justify-center rounded-full bg-black/30 text-white transition-colors duration-300 group-hover/avatar:bg-black/20">
          <Camera />
        </span>
      </button>

      {imageToCrop && (
        <CropImageDialog
          src={URL.createObjectURL(imageToCrop)}
          cropAspectRatio={1}
          onClose={() => {
            setImageToCrop(undefined);
            if (fileInputref.current) {
              fileInputref.current.value = "";
            }
          }}
          onCropped={onImageCropped}
        />
      )}
    </>
  );
}
