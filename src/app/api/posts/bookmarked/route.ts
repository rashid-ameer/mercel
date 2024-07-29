import { validateRequest } from "@/auth";
import { POSTS_PER_PAGE } from "@/lib/constants";
import prisma from "@/lib/prisma";
import { getPostDataInclude, PagePost } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    const bookmarks = await prisma.bookmark.findMany({
      where: {
        userId: user.id,
      },
      include: {
        post: {
          include: getPostDataInclude(user.id),
        },
      },
      take: POSTS_PER_PAGE + 1,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: "desc" },
    });

    const nextCursor =
      bookmarks.length > POSTS_PER_PAGE ? bookmarks[POSTS_PER_PAGE].id : null;

    const data: PagePost = {
      nextCursor,
      posts: bookmarks.map((bookmark) => bookmark.post),
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
