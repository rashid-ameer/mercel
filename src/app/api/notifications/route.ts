import { validateRequest } from "@/auth";
import { PAGE_SIZE } from "@/lib/constants";
import prisma from "@/lib/prisma";
import { notificationInclude, NotificationPage } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // check if user is authorized
    const { user } = await validateRequest();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    // fetching notifications
    const notifications = await prisma.notification.findMany({
      where: {
        recipientId: user.id,
      },
      include: notificationInclude,
      take: PAGE_SIZE + 1,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: "desc" },
    });

    const nextCursor =
      notifications.length > PAGE_SIZE ? notifications[PAGE_SIZE].id : null;

    const data: NotificationPage = {
      notifications: notifications.slice(0, PAGE_SIZE),
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error." }, { status: 500 });
  }
}
