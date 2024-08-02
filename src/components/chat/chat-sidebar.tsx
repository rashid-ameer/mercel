import useSession from "@/hooks/useSessionProvider";
import {
  ChannelList,
  ChannelPreviewMessenger,
  ChannelPreviewUIComponentProps,
} from "stream-chat-react";
import { Button } from "../ui/button";
import { ArrowLeft, Mail, MailPlus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCallback, useState } from "react";
import NewChatDialog from "./new-chat-dialog";

interface ChatSidebarProps {
  open: boolean;
  onClose: () => void;
}

function ChatSidebar({ open, onClose }: ChatSidebarProps) {
  const { user } = useSession();

  const CustomChannelPreview = useCallback(
    (props: ChannelPreviewUIComponentProps) => {
      return (
        <ChannelPreviewMessenger
          {...props}
          onSelect={() => {
            props.setActiveChannel?.(props.channel, props.watchers);

            onClose();
          }}
        />
      );
    },
    [onClose],
  );

  return (
    <div
      className={cn(
        "size-full flex-col border-e md:flex md:w-72",
        open ? "flex" : "hidden",
      )}
    >
      <MenuHeader onClose={onClose} />
      <ChannelList
        filters={{ type: "messaging", members: { $in: [user.id] } }}
        showChannelSearch
        options={{ state: true, presence: true, limit: 8 }}
        sort={{ last_message_at: -1 }}
        additionalChannelSearchProps={{
          searchForChannels: true,
          searchQueryParams: {
            channelFilters: {
              filters: {
                members: { $in: [user.id] },
              },
            },
          },
        }}
        Preview={CustomChannelPreview}
      />
    </div>
  );
}
export default ChatSidebar;

interface MenuHeaderProps {
  onClose: () => void;
}

function MenuHeader({ onClose }: MenuHeaderProps) {
  const [isChatDialogOpen, setIsChatDialogOpen] = useState(false);
  return (
    <>
      <div className="flex items-center gap-3 p-2">
        <div className="h-full md:hidden">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="size-5" />
          </Button>
        </div>

        <h1 className="text-xl font-semibold md:ms-2">Messages</h1>

        <Button
          onClick={() => setIsChatDialogOpen(true)}
          variant="ghost"
          size="icon"
          className="ml-auto flex"
          title="Start a new channel"
        >
          <MailPlus className="size-5" />
        </Button>
      </div>
      {isChatDialogOpen && (
        <NewChatDialog
          onOpenChange={setIsChatDialogOpen}
          onChatCreated={() => {
            setIsChatDialogOpen(false);
            onClose();
          }}
        />
      )}
    </>
  );
}
