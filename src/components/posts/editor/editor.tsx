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

function PostEditor() {
  const { toast } = useToast();
  const { user } = useSession();
  const postCreateMutation = useCreatePostMutation();

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
    const validationResult = createPostSchema.safeParse({ content: input });
    if (!validationResult.success) {
      return;
    }

    postCreateMutation.mutate(input, {
      onSuccess: () => {
        toast({ description: "Post created successfully." });
      },
      onError: () => {
        toast({
          variant: "destructive",
          description: "Failed to create post. Try again.",
        });
      },
    });
    editor?.commands.clearContent();
  };

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex items-start gap-5">
        <UserAvatar avatarUrl={user.avatarUrl} />
        <EditorContent
          editor={editor}
          className="max-h-[20rem] min-h-[7rem] flex-1 overflow-y-auto rounded-xl bg-muted px-5 py-3"
        />
      </div>

      <Button
        onClick={onSubmit}
        className="ml-auto flex min-w-20 rounded-full"
        disabled={postCreateMutation.isPending || !input}
      >
        Post
      </Button>
    </div>
  );
}
export default PostEditor;
