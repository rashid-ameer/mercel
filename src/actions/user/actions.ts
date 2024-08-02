"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { updateUserProfileSchema } from "@/lib/schemas";
import streamServerClient from "@/lib/stream";
import { getUserDataSelect } from "@/lib/types";

export async function updateUserProfile(profileData: unknown) {
  const validationResult = updateUserProfileSchema.safeParse(profileData);
  if (!validationResult.success) {
    throw new Error("Invalid data");
  }

  // check if user is authenticated
  const { user } = await validateRequest();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const updatedUser = await prisma.$transaction(async (tx) => {
    // update user profile
    const updatedUser = await tx.user.update({
      where: {
        id: user.id,
      },
      data: validationResult.data,
      select: getUserDataSelect(user.id),
    });

    await streamServerClient.partialUpdateUser({
      id: user.id,
      set: {
        name: updatedUser.displayName,
      },
    });

    return updatedUser;
  });

  return updatedUser;
}
