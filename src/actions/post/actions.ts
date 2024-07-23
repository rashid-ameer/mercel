"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { createPostSchema } from "@/lib/schemas";
import { postDataInclude } from "@/lib/types";

export async function createPost(input: unknown) {
  // checking if user if authorized
  const session = await validateRequest();
  if (!session.user) {
    throw new Error("Unauthorized");
  }

  // validate input
  const { content } = createPostSchema.parse({ content: input });

  // create post
  const post = await prisma.post.create({
    data: {
      content: content,
      userId: session.user.id,
    },
    include: postDataInclude,
  });

  return post;
}
