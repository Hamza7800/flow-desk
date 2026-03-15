import { cacheWrap } from "@/lib/cache";
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
  const hdrs = await headers();
  const token = hdrs.get("cookie") ?? hdrs.get("authorization") ?? "no-token";

  // const session = await auth.api.getSession({
  //   headers: await headers(),
  // });

  const session = await cacheWrap(
    `session:${token.slice(-32)}`,
    () => auth.api.getSession({ headers: hdrs }),
    1000 * 30,
  );

  if (!session?.session.activeOrganizationId)
    throw new Error("No active organization");

  return {
    userId: session.user.id,
    orgId: session.session.activeOrganizationId,
  };
});
