import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";

// Create the connection
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not defined");
}

console.log("Connecting to database...");

// Ensure the connection string is passed as a string
export const client = postgres(connectionString as string);
export const db = drizzle(client, { schema });