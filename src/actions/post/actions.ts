"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { createPostSchema } from "@/lib/schemas";

export async function createPost(input: unknown) {
  // checking if user if authorized
  const session = await validateRequest();
  if (!session.user) {
    throw new Error("Unauthorized");
  }

  // validate input
  const validateResult = createPostSchema.safeParse(input);
  if (!validateResult.success) {
    return {
      error: "Invalid input",
    };
  }

  // create post
  await prisma.post.create({
    data: {
      content: validateResult.data.content,
      userId: session.user.id,
    },
  });
}
