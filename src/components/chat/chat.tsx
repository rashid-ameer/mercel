"use client";
import { Chat as StreamChat, useChatContext } from "stream-chat-react";

import useInitializeChatClient from "@/hooks/useInitializeChatClient";
import { CircularLoader } from "@/components/loaders";
import ChatSidebar from "./chat-sidebar";
import ChatChannel from "./chat-channel";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

function Chat() {
  const chatClient = useInitializeChatClient();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { resolvedTheme } = useTheme();
  const queryClient = useQueryClient();
  const { channel } = useChatContext();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["unread-messages-count"] });
  }, [queryClient, channel?.id]);

  if (!chatClient) return <CircularLoader />;

  return (
    <main className="relative flex-1 overflow-hidden rounded-2xl bg-card shadow-sm">
      <div className="absolute bottom-0 top-0 flex h-full w-full">
        <StreamChat
          client={chatClient}
          theme={
            resolvedTheme === "dark"
              ? "str-chat__theme-dark"
              : "str-chat__theme-light"
          }
        >
          <ChatSidebar
            open={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
          <ChatChannel
            open={!isSidebarOpen}
            openSidebar={() => setIsSidebarOpen(true)}
          />
        </StreamChat>
      </div>
    </main>
  );
}
export default Chat;
