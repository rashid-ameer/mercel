import { validateRequest } from "@/auth";
import streamServerClient from "@/lib/stream";
import { MessagesCountInfo } from "@/lib/types";

export async function GET() {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const unreadCount = await streamServerClient.getUnreadCount(user.id);

    const data: MessagesCountInfo = {
      unreadCount: unreadCount.total_unread_count,
    };

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
