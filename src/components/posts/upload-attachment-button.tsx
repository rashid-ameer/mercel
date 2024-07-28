import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";
import { useRef } from "react";

interface UploadAttachmentButtonProps {
  onFilesSelected: (files: File[]) => void;
  disabled: boolean;
}

function UploadAttachmentButton({
  onFilesSelected,
  disabled,
}: UploadAttachmentButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <Button
        disabled={disabled}
        size="icon"
        className="text-primary hover:text-primary/60"
        variant="ghost"
        onClick={() => inputRef.current?.click()}
      >
        <ImageIcon size={24} />
      </Button>

      <input
        className="sr-only hidden"
        ref={inputRef}
        type="file"
        accept="image/*, video/*"
        multiple
        onChange={(e) => {
          const files = Array.from(e.target.files || []);

          if (files.length > 0) {
            onFilesSelected(files);
            e.target.value = "";
          }
        }}
      />
    </>
  );
}
export default UploadAttachmentButton;
