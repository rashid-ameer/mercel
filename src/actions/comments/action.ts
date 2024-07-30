"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { createCommentSchema } from "@/lib/schemas";
import { getCommentDataInclude, TPost } from "@/lib/types";

export async function createComment({
  post,
  content,
}: {
  post: TPost;
  content: string;
}) {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) {
    throw new Error("Unauthorized");
  }

  // validate data
  const validatedData = createCommentSchema.safeParse({ content });
  if (!validatedData.success) {
    throw new Error("Invalid data format");
  }

  // create comment
  const newComment = prisma.comment.create({
    data: {
      content: validatedData.data.content,
      userId: loggedInUser.id,
      postId: post.id,
    },
    include: getCommentDataInclude(loggedInUser.id),
  });

  return newComment;
}

export async function deleteComment(id: string) {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) {
    throw new Error("Unauthorized");
  }

  // get comment
  const comment = await prisma.comment.findUnique({
    where: {
      id,
    },
  });

  if (!comment) {
    throw new Error("Comment not found");
  }

  if (comment.userId !== loggedInUser.id) {
    throw new Error("Unauthorized");
  }

  // delete comment
  const deleteComment = await prisma.comment.delete({
    where: {
      id,
    },
    include: getCommentDataInclude(loggedInUser.id),
  });

  return deleteComment;
}
