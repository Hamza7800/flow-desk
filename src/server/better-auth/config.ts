import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { stripe } from "@better-auth/stripe";
import { env } from "@/env";
import { db } from "@/server/db";
import Stripe from "stripe";
import { nextCookies } from "better-auth/next-js";
import { organization } from "better-auth/plugins";

const stripeClient = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-01-28.clover",
});

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    organization({
      teams: {
        enabled: true,
        maximumTeams: 2,
        maximumMembersPerTeam: 10,
        allowRemovingAllTeams: false,
      },
    }),
    stripe({
      stripeClient,
      stripeWebhookSecret: env.STRIPE_WEBHOOK_SECRET,
      createCustomerOnSignUp: true,
      subscription: {
        enabled: true,
        plans: [
          {
            name: "Plane One",
          },
        ],
      },
    }),
    // LAST PLUGIN MUST BE NEXT COOKIES
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
