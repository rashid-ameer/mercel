import { validateRequest } from "@/auth";
import streamServerClient from "@/lib/stream";

export async function GET() {
  try {
    const { user } = await validateRequest();

    console.log("Calling get-token for user", user?.id);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }
    // Create a token that expires in 1 hour
    const expirationTime = Math.floor(Date.now() / 1000) + 3600;
    // Token was issued 60 seconds ago
    const issuedTime = Math.floor(Date.now() / 1000) - 60;

    // Create a token for the user
    const token = streamServerClient.createToken(
      user.id,
      expirationTime,
      issuedTime,
    );
    // Return the token to the client
    return Response.json({ token });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server errro" }, { status: 500 });
  }
}
