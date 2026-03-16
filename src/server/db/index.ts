// import { drizzle } from "drizzle-orm/postgres-js";
// import postgres from "postgres";

// import { env } from "@/env";
// import * as schema from "./schema";

// /**
//  * Cache the database connection in development. This avoids creating a new connection on every HMR
//  * update.
//  */
// const globalForDb = globalThis as unknown as {
//   conn: postgres.Sql | undefined;
// };

// const conn = globalForDb.conn ?? postgres(env.DATABASE_URL);
// if (env.NODE_ENV !== "production") globalForDb.conn = conn;

// export const db = drizzle(conn, { schema });

// import { drizzle } from "drizzle-orm/libsql";
// import { createClient } from "@libsql/client";
// import * as schema from "./schema";
// import { env } from "@/env";

// const client = createClient({
//   url: env.TURSO_CONNECTION_URL!,
//   authToken: env.TURSO_AUTH_TOKEN!,
// });

// export const db = drizzle(client, { schema });

import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
import { env } from "@/env";

const globalForDb = globalThis as unknown as {
  client: ReturnType<typeof createClient> | undefined;
};

const isProduction = process.env.NODE_ENV === "production";

const client =
  globalForDb.client ??
  createClient(
    isProduction
      ? {
          // ✅ production (Linux/Railway) — embedded replica, reads from local file
          url: "file:local-replica.db",
          syncUrl: env.TURSO_CONNECTION_URL!,
          authToken: env.TURSO_AUTH_TOKEN!,
          syncInterval: 60,
        }
      : {
          // ✅ dev (Windows) — direct remote, no sync
          url: env.TURSO_CONNECTION_URL!,
          authToken: env.TURSO_AUTH_TOKEN!,
        },
  );

// ✅ singleton in dev to survive HMR
if (!isProduction) {
  globalForDb.client = client;
}

// ✅ only sync in production where filesystem is available
if (isProduction) {
  client
    .sync()
    .then(() => console.log("✅ Replica synced"))
    .catch((err) => console.error("❌ Replica sync failed:", err));
}

export const db = drizzle(client, { schema });
