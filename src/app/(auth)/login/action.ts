import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import { loginSchema } from "@/lib/schemas";
import { verify } from "@node-rs/argon2";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(credentials: unknown) {
  try {
    // validate the data format
    const loginResults = loginSchema.safeParse(credentials);
    if (!loginResults.success) {
      return { error: "Invalid data format." };
    }

    // get data
    const { username, password } = loginResults.data;

    // check if the user with username exists
    const existingUser = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });

    if (!existingUser || !existingUser.passwordHash) {
      return { error: "Invalid username or password." };
    }

    // check if the password is correct
    const validPassword = await verify(existingUser.passwordHash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    if (!validPassword) {
      return { error: "Invalid username or password." };
    }

    // create a new session
    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    // redirect user to homepage
    return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    console.error(error);
    return { error: "Something went wrong. Please try again." };
  }
}
