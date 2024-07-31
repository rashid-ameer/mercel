import { validateRequest } from "@/auth";
import { PAGE_SIZE } from "@/lib/constants";
import prisma from "@/lib/prisma";
import { getPostDataInclude } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params: { userId } }: { params: { userId: string } },
) {
  try {
    // check if user is authorized
    const { user } = await validateRequest();
    if (!user) {
      return Response.json({ error: "Unauthorized request" }, { status: 401 });
    }

    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    // fetching posts
    const posts = await prisma.post.findMany({
      where: {
        userId: userId,
      },
      include: getPostDataInclude(user.id),
      take: PAGE_SIZE + 1,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: "desc" },
    });

    const nextCursor = posts.length > PAGE_SIZE ? posts[PAGE_SIZE].id : null;

    return Response.json({ posts: posts.slice(0, PAGE_SIZE), nextCursor });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error." }, { status: 500 });
  }
}
