import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { DATABASE_URL } from "@/config";

config({ path: ".env.local" });

const sql = neon(DATABASE_URL);

const db = drizzle(sql, { logger: true });

export { db };
