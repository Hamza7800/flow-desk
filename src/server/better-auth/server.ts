import { auth } from ".";
import { headers } from "next/headers";
import { cache } from "react";

export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
);

export const getUser = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || !session?.user.id) {
    throw new Error("Unauthorized: You must be logged in");
  }

  return session.user;
};

export const getActiveOrgId = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.session.activeOrganizationId)
    throw new Error("No active organization");

  return {
    userId: session.user.id,
    orgId: session.session.activeOrganizationId,
  };
});
