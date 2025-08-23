// db.js
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "./db/schema";
import { readFileSync } from "fs";
import { config } from "dotenv";

config(); // Load environment variables

const pgConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: true,
    ca: readFileSync("./ca.pem").toString(),
  },
};

const client = new Client(pgConfig);

async function initializeDb() {
  try {
    await client.connect();
    console.log("Connected to Aiven PostgreSQL");
  } catch (err) {
    console.error("Failed to connect to Aiven PostgreSQL:", err);
    throw err;
  }
}

const db = drizzle(client, { schema });

export { db, initializeDb };
