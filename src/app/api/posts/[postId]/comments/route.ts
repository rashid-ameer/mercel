import { validateRequest } from "@/auth";
import { COMMENTS_PER_PAGE } from "@/lib/constants";
import prisma from "@/lib/prisma";
import {
  CommentPage,
  getCommentDataInclude,
  getUserDataSelect,
} from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params: { postId } }: { params: { postId: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest();
    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // cursor
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    // get comments
    const comments = await prisma.comment.findMany({
      where: {
        postId: postId,
      },
      include: getCommentDataInclude(loggedInUser.id),
      take: -COMMENTS_PER_PAGE - 1,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: "asc" },
    });

    const previousCursor =
      comments.length > COMMENTS_PER_PAGE ? comments[0].id : null;

    const data: CommentPage = {
      comments:
        comments.length > COMMENTS_PER_PAGE ? comments.slice(1) : comments,
      previousCursor,
    };
    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
