import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { createUploadthing, FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const fileRouter = {
  avatar: f({ image: { maxFileSize: "512KB" } })
    .middleware(async () => {
      // validating a request
      // this code will run on out server before uploading the file
      const { user } = await validateRequest();
      if (!user) {
        throw new UploadThingError("Unauthorized");
      }

      // whatever is returned here is available on onUploadComplete as metadata
      return { user };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // this code runs on a server after the file is uploaded
      // making new url for security reasons
      const newAvatarUrl = file.url.replace(
        "/f/",
        `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
      );

      // updating the user's avatarUrl
      await prisma.user.update({
        where: { id: metadata.user.id },
        data: { avatarUrl: newAvatarUrl },
      });

      return { avatarUrl: newAvatarUrl };
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;
