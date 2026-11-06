// better-auth.config.ts
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { getDb } from "./src/db"
import { betterAuthOptions } from "./src/lib/better-auth/options"

const { DATABASE_URL, BETTER_AUTH_URL, BETTER_AUTH_SECRET } = process.env

const db = getDb(DATABASE_URL);


export const auth = betterAuth({
  ...betterAuthOptions,
  database: drizzleAdapter(db, { provider: "pg" }),
  baseURL: BETTER_AUTH_URL,
  secret: BETTER_AUTH_SECRET,
})