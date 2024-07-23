import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { postDataInclude } from "@/lib/types";

export async function GET() {
  try {
    // check if user is authorized
    const { user } = await validateRequest();
    if (!user) {
      return Response.json({ error: "Unauthorized request." }, { status: 401 });
    }

    // fetching posts
    const posts = await prisma.post.findMany({
      include: postDataInclude,
      orderBy: { createdAt: "desc" },
    });

    return Response.json(posts);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error." }, { status: 500 });
  }
}
