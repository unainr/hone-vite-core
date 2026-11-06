import { z } from "zod";

const schema = z.object({
	VITE_API_URL: z.string().url(),
});

const parsed = schema.safeParse(import.meta.env);

if (!parsed.success) {
	console.error("Invalid env:", parsed.error.flatten().fieldErrors);
	throw new Error("Missing or invalid environment variables");
}

export const env = {
	apiUrl: parsed.data.VITE_API_URL,
};
