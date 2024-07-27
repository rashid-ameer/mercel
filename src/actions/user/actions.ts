"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { updateUserProfileSchema } from "@/lib/schemas";
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

  // update user profile
  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: validationResult.data,
    select: getUserDataSelect(user.id),
  });

  return updatedUser;
}
