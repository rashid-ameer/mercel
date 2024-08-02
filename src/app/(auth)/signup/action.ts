"use server";

import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import { signupSchema } from "@/lib/schemas";
import streamServerClient from "@/lib/stream";
import { hash } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import {
  isRedirectError,
  RedirectType,
} from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signup(credentials: unknown): Promise<{ error: string }> {
  try {
    // Validate the data format
    const signupResult = signupSchema.safeParse(credentials);

    if (!signupResult.success) {
      return { error: "Invalid data format" };
    }

    // get the data
    const { username, email, password } = signupResult.data;

    // create password hash
    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    // generate a user id
    const userId = generateIdFromEntropySize(10);

    // check if the username already exists
    const existingUsername = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });

    if (existingUsername) {
      return { error: "Username already exists" };
    }

    // check if email already exists
    const existingEmail = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });

    if (existingEmail) {
      return { error: "Email already exists." };
    }

    await prisma.$transaction(async (tx) => {
      // create the new user
      await tx.user.create({
        data: {
          id: userId,
          username,
          displayName: username,
          email,
          passwordHash,
        },
      });

      await streamServerClient.upsertUser({
        id: userId,
        name: username,
        username,
      });
    });

    // create a session
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return redirect("/", RedirectType.replace);
  } catch (error) {
    // if the error is redirect error
    if (isRedirectError(error)) {
      throw error;
    }

    console.error(error);
    return { error: "Something went wrong. Please try again later." };
  }
}
