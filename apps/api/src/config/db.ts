import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { env } from "./env";
import * as schema from "../db/schema";

const sql = env.DATABASE_URL ? neon(env.DATABASE_URL) : ((): any => null);
export const db = env.DATABASE_URL ? drizzle(sql, { schema }) : (null as any);

