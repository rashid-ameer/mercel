"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "../../ui/button";
import UserAvatar from "../../user-avatar";
import useSession from "@/hooks/useSessionProvider";
import "./styles.css";
import { useCreatePostMutation } from "@/lib/react-query-utils";
import { useToast } from "@/components/ui/use-toast";
import { createPostSchema } from "@/lib/schemas";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import UploadAttachmentButton from "../upload-attachment-button";
import { Attachment } from "@/lib/types";
import Image from "next/image";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CircularLoader } from "@/components/loaders";
import { useDropzone } from "@uploadthing/react/hooks";
import { ClipboardEvent } from "react";

function PostEditor() {
  const { toast } = useToast();
  const { user } = useSession();
  const postCreateMutation = useCreatePostMutation();
  const {
    attachments,
    isUploading,
    uploadProgress,
    reset: resetMedia,
    removeAttachment,
    startUpload,
  } = useMediaUpload();

  // dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: startUpload,
  });
  const { onClick, ...rootProps } = getRootProps();

  // editor configuration
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "Write a post...",
      }),
    ],
  });

  // Get the editor content
  const input = editor?.getText({ blockSeparator: "\n" }).trim() ?? "";

  // submit handler
  const onSubmit = async () => {
    const validationResult = createPostSchema.safeParse({
      content: input,
      mediaIds: attachments
        .map((a) => a.mediaId)
        .filter((id): id is string => !!id),
    });

    if (!validationResult.success) {
      return;
    }

    postCreateMutation.mutate(
      {
        content: input,
        mediaIds: attachments
          .map((a) => a.mediaId)
          .filter((id): id is string => !!id),
      },
      {
        onSuccess: () => {
          editor?.commands.clearContent();
          resetMedia();
          toast({ description: "Post created successfully." });
        },
        onError: () => {
          toast({
            variant: "destructive",
            description: "Failed to create post. Try again.",
          });
        },
      },
    );
  };

  // paste function
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const files = Array.from(e.clipboardData.items)
      .filter((item) => item.kind === "file")
      .map((item) => item.getAsFile()) as File[];
    startUpload(files);
  };

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex items-start gap-5">
        <UserAvatar avatarUrl={user.avatarUrl} priority={true} />
        <div {...rootProps} className="w-full">
          <EditorContent
            editor={editor}
            disabled={postCreateMutation.isPending}
            className={cn(
              "max-h-[20rem] min-h-[7rem] flex-1 overflow-y-auto rounded-xl bg-muted px-5 py-3",
              { "outline-dashed": isDragActive },
            )}
            onPaste={handlePaste}
          />
          <input {...getInputProps()} />
        </div>
      </div>

      {!!attachments.length && (
        <AttachmentsPreview
          attachments={attachments}
          onRemoveAttachment={removeAttachment}
        />
      )}

      <div className="flex items-center justify-end gap-3">
        {isUploading && (
          <>
            <span className="text-sm">{uploadProgress ?? 0}%</span>
            <CircularLoader className="mx-0" />
          </>
        )}
        <UploadAttachmentButton
          disabled={
            isUploading ||
            attachments.length >= 5 ||
            postCreateMutation.isPending
          }
          onFilesSelected={startUpload}
        />
        <Button
          onClick={onSubmit}
          className="flex min-w-20 rounded-full"
          disabled={postCreateMutation.isPending || !input || isUploading}
        >
          Post
        </Button>
      </div>
    </div>
  );
}
export default PostEditor;

// attachments
interface AttachmentsPreviewProps {
  attachments: Attachment[];
  onRemoveAttachment: (fileName: string) => void;
}

function AttachmentsPreview({
  attachments,
  onRemoveAttachment,
}: AttachmentsPreviewProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3",
        attachments.length > 1 && "sm:grid sm:grid-cols-2",
      )}
    >
      {attachments.map((attachment) => (
        <AttachmentPreview
          key={attachment.file.name}
          attachment={attachment}
          onRemoveAttachment={() => onRemoveAttachment(attachment.file.name)}
        />
      ))}
    </div>
  );
}

// attachment preview

interface AttachmentPreviewProps {
  attachment: Attachment;
  onRemoveAttachment: () => void;
}

function AttachmentPreview({
  attachment: { file, isUploading, mediaId },
  onRemoveAttachment,
}: AttachmentPreviewProps) {
  const src = URL.createObjectURL(file);

  return (
    <div className={cn("relative", { "opacity-50": isUploading })}>
      {file.type.startsWith("image") ? (
        <Image
          src={src}
          alt="Image preview"
          height={500}
          width={500}
          className="max-h-[30rem] w-auto rounded-2xl object-cover"
        />
      ) : (
        <video controls className="max-h-[30rem] w-auto rounded-2xl">
          <source src={src} />
        </video>
      )}

      {!isUploading && (
        <button
          onClick={onRemoveAttachment}
          className="absolute right-3 top-3 rounded-full bg-foreground p-1.5 text-background transition-colors hover:bg-foreground/60"
        >
          <X size={24} />
        </button>
      )}
    </div>
  );
}
