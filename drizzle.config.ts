import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config({ path: "./.env.local" });

console.log("data base url", process.env.DATABASE_URL);
export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
