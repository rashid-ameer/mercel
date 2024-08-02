import { cn } from "@/lib/utils";
import {
  Channel,
  ChannelHeader,
  ChannelHeaderProps,
  MessageInput,
  MessageList,
  Window,
} from "stream-chat-react";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";

interface ChatChannelProps {
  open: boolean;
  openSidebar: () => void;
}

function ChatChannel({ open, openSidebar }: ChatChannelProps) {
  return (
    <div className={cn("flex-1 md:block", { hidden: !open })}>
      <Channel>
        <Window>
          <CustomChannelHeader openSidebar={openSidebar} />
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </div>
  );
}
export default ChatChannel;

interface CustomChannelHeader extends ChannelHeaderProps {
  openSidebar: () => void;
}

function CustomChannelHeader({ openSidebar, ...props }: CustomChannelHeader) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-full p-2 md:hidden">
        <Button size="icon" variant="ghost" onClick={openSidebar}>
          <Menu className="size-5" />
        </Button>
      </div>
      <ChannelHeader {...props} />
    </div>
  );
}
