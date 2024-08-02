import { validateRequest } from "@/auth";
import { PAGE_SIZE } from "@/lib/constants";
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
    const q = req.nextUrl.searchParams.get("q") || "";

    const searchQuery = q.split(" ").join(" & ");

    const posts = await prisma.post.findMany({
      where: {
        OR: [
          {
            content: {
              search: searchQuery,
            },
          },
          {
            user: {
              displayName: {
                search: searchQuery,
              },
            },
          },
          {
            user: {
              username: {
                search: searchQuery,
              },
            },
          },
        ],
      },
      include: getPostDataInclude(user.id),
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor = posts.length > PAGE_SIZE ? posts[PAGE_SIZE].id : null;

    const data: PagePost = {
      posts: posts.slice(0, PAGE_SIZE),
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
