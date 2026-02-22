import { stripeClient } from "@better-auth/stripe/client";
import { organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { ac, memberRole, adminRole, ownerRole } from "@/lib/permissions";

export const authClient = createAuthClient({
  plugins: [
    organizationClient({
      ac,
      roles: {
        member: memberRole,
        admin: adminRole,
        owner: ownerRole,
      },
    }),
    stripeClient({
      subscription: true,
    }),
  ],
});

export type Session = typeof authClient.$Infer.Session;
