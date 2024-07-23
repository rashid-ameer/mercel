import { validateRequest } from "@/auth";
import { POSTS_PER_PAGE } from "@/lib/constants";
import prisma from "@/lib/prisma";
import { postDataInclude } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // check if user is authorized
    const { user } = await validateRequest();
    if (!user) {
      return Response.json({ error: "Unauthorized request." }, { status: 401 });
    }

    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    // fetching posts
    const posts = await prisma.post.findMany({
      include: postDataInclude,
      take: POSTS_PER_PAGE + 1,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: "desc" },
    });

    const nextCursor =
      posts.length > POSTS_PER_PAGE ? posts[POSTS_PER_PAGE].id : null;

    return Response.json({ posts: posts.slice(0, POSTS_PER_PAGE), nextCursor });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error." }, { status: 500 });
  }
}
