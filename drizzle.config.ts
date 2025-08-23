// drizzle.config.ts
import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
import { readFileSync } from "fs";

config({ path: "./.env.local" }); // Load environment variables

// Validate environment variables
const requiredEnvVars = {
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
};

for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}
const ssl =
  process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: true, ca: readFileSync("./ca.pem").toString() }
    : false;

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db",
  out: "./src/db/migrations",
  dbCredentials: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST as string,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME as string,
    ssl,
  },
});
