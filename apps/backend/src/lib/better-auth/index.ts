// src/lib/better-auth/index.ts
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth";
import { betterAuthOptions } from "./options";

import * as schema from "../../db/schema";
import { getDb } from "../../db";

export const auth = (env: CloudflareBindings) => {
	const db = getDb(env.DATABASE_URL);

	return betterAuth({
		...betterAuthOptions,
		database: drizzleAdapter(db, { provider: "pg", schema }),
		baseURL: env.BETTER_AUTH_URL,
		secret: env.BETTER_AUTH_SECRET,
		trustedOrigins: [env.WEB_URL],
		socialProviders: {
			google: {
				clientId: env.GOOGLE_CLIENT_ID,
				clientSecret: env.GOOGLE_CLIENT_SECRET,
				prompt: "select_account", // always show the account picker
			},
		},
	});
};
