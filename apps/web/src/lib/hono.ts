import { hc } from "hono/client";
import type { AppType } from "@backend/api";
import { env } from "./env";

type GetToken = () => Promise<string | null>;

// Starts as a no-op so any request fired before Clerk mounts
// goes out unauthenticated instead of throwing.
let getTokenRef: GetToken = async () => null;

export function setAuthTokenGetter(fn: GetToken) {
	getTokenRef = fn;
}

export const client = hc<AppType>(env.apiUrl, {
	headers: async (): Promise<Record<string, string>> => {
		const token = await getTokenRef();
		return token ? { Authorization: `Bearer ${token}` } : {};
	},
});
