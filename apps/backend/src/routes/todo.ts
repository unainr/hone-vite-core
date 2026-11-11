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



const chatSchema = z.object({
	title: z.string(),
    description: z.string()
});

const app = new Hono<{ Bindings: CloudflareBindings }>()


export default app;