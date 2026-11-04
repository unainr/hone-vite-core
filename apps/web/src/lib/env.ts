import { z } from "zod";

const schema = z.object({
  VITE_API_URL: z.string().url(),
  VITE_CLERK_PUBLISHABLE_KEY: z.string().min(1),
});

const parsed = schema.safeParse(import.meta.env);

if (!parsed.success) {
  console.error("Invalid env:", parsed.error.flatten().fieldErrors);
  throw new Error("Missing or invalid environment variables");
}

export const env = {
  apiUrl: parsed.data.VITE_API_URL,
  clerkKey: parsed.data.VITE_CLERK_PUBLISHABLE_KEY,
};