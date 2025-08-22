// Comment out when using Neon with drizzle-orm/neon-http to help with debugging  
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);

const db = drizzle(sql, { logger: true });

export { db };


// import { Pool, neonConfig } from "@neondatabase/serverless";
// import { drizzle } from "drizzle-orm/neon-serverless";
// import { config } from "dotenv";
// import ws from "ws";
// import * as schema from "./schema/schema";

// neonConfig.webSocketConstructor = ws;

// config({ path: ".env.local" });

// if (!process.env.DATABASE_URL) {
//   throw new Error("DATABASE_URL is not defined");
// }

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });
// export const db = drizzle({ client: pool, schema, logger: true });
