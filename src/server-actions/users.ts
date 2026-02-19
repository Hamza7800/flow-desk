"use server";

import { auth } from "@/server/better-auth";
import { headers } from "next/headers";

export const getAuthenticatedUser = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || !session?.user.id) {
    return {
      success: false,
      message: "Unauthorized: You must be logged in",
    };
  }

  return {
    success: true,
    user: session.user,
  };
};
