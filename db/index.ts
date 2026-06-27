import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString && process.env.NODE_ENV === "production") {
  console.warn("Warning: DATABASE_URL environment variable is not set, using default development fallback.");
}

const dbUrl = connectionString || "postgresql://postgres:postgres@localhost:5432/padelsociety";

const pool = new Pool({
  connectionString: dbUrl,
  max: 20,
});

export const db = drizzle(pool, { schema });
export type DbType = typeof db;
