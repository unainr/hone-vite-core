import { groq } from "@ai-sdk/groq";
import { zValidator } from "@hono/zod-validator";
import {
	convertToModelMessages,
	createUIMessageStreamResponse,
	stepCountIs,
	streamText,
	toUIMessageStream,
	UIMessage,
} from "ai";
import { Hono } from "hono";
import { z } from "zod";
import { requireUser } from "../middleware/auth";
import { tools } from "../tools";
import { getDb } from "../db";
import { Todo } from "../db/schema";


const chatSchema = z.object({
	title: z.string(),
    description: z.string()
});

const app = new Hono<{ Bindings: CloudflareBindings }>()

	.get("/", async (c) => {
		return c.json({ message: "test route Hello world" });
	})

	.post("/", zValidator("json", chatSchema), requireUser, async (c) => {
		const { title, description } = c.req.valid("json");

	const db = await getDb(c.env.DATABASE_URL)

        const result = await db.insert(Todo).values({
            title,
            description,
        }).returning();

        return c.json({ message: "Todo created successfully", data: result });

});

export default app;