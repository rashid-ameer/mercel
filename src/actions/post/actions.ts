"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { createPostSchema, deletePostSchema } from "@/lib/schemas";
import { postDataInclude } from "@/lib/types";

// create a post
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

// delete a post
export async function deletePost(id: unknown) {
  // checking if user if authorized
  const { user } = await validateRequest();
  if (!user) {
    throw new Error("Unauthorized");
  }

  // validate input
  const postId = deletePostSchema.parse(id);

  // check if post exists
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    throw new Error("Post not found.");
  }

  // check if user is authorized to delete post
  if (user.id !== post.userId) {
    throw new Error("Unauthorized");
  }

  // delete post
  const deletedPost = await prisma.post.delete({
    where: {
      id: postId,
    },
    include: postDataInclude,
  });

  return deletedPost;
}
