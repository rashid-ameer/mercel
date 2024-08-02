import { Chat } from "@/components/chat";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Messages",
};

function ChatPage() {
  return <Chat />;
}
export default ChatPage;
