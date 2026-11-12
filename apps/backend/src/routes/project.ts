import { zValidator } from "@hono/zod-validator";

import { generateText, Output } from "ai";
import { asc, eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

import { projects, screens } from "../db/schema";
import { getDb } from "../db";
import { groq } from "@ai-sdk/groq";
import { requireUser } from "../middleware/auth";

const BODY_ONLY = `You are a web UI designer. Return ONLY the HTML for the <body> of one screen,
styled with Tailwind CSS classes. No <html>, <head>, <script>, markdown, or explanation.`;

// Strip ```html fences and keep only the body if the model returns a full document
function clean(raw: string) {
	const text = raw.replace(/```(?:html)?/g, "").trim();
	const body = text.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
	return body ? body[1].trim() : text;
}

const app = new Hono<{ Bindings: CloudflareBindings }>()
	// GET /api/screens/:projectId -> all screens of a project
	.get("/:projectId", async (c) => {
		const db = await getDb(c.env.DATABASE_URL);

		const rows = await db
			.select()
			.from(screens)
			.where(eq(screens.projectId, c.req.param("projectId")))
			.orderBy(asc(screens.createdAt));
		return c.json(rows);
	})
// POST /api/project -> create an empty project (fast), returns its id
.post("/", requireUser, zValidator("json", z.object({ prompt: z.string().min(1) })), async (c) => {
	const { prompt } = c.req.valid("json");
	const db = getDb(c.env.DATABASE_URL);
	const [project] = await db
		.insert(projects)
		.values({ userId: c.get("userId"), name: prompt.slice(0, 60) })
		.returning({ id: projects.id });
	return c.json(project);
})
	// POST /api/screens/:projectId/generate -> AI plans N screens, builds each, saves them
	.post(
		"/:projectId/generate",
		zValidator("json", z.object({ prompt: z.string().min(1) })),
		async (c) => {
			const db = await getDb(c.env.DATABASE_URL);

			const { prompt } = c.req.valid("json");
			const projectId = c.req.param("projectId");

			// Step 1: plan which screens are needed
			const { output: plan } = await generateText({
				model: groq("openai/gpt-oss-20b"),
				output: Output.object({
					schema: z.object({
						screens: z
							.array(z.object({ title: z.string(), description: z.string() }))
							.min(1)
							.max(6),
					}),
				}),
				prompt: `List the screens needed for this request (max 6), each with a short title and a one-sentence description.\n\n${prompt}`,
			});

			// Step 2: generate every screen in parallel
			const generated = await Promise.all(
				plan.screens.map(async (s) => {
					const { text } = await generateText({
						model: groq("openai/gpt-oss-20b"),

						system: BODY_ONLY,
						prompt: `App request: ${prompt}\nScreen: ${s.title}\nDetails: ${s.description}`,
					});
					return { projectId, title: s.title, html: clean(text) };
				}),
			);

			const rows = await db.insert(screens).values(generated).returning();
			return c.json(rows);
		},
	);

export default app;
