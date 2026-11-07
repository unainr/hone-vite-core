import { Hono } from "hono";
import { cors } from "hono/cors";
import chat from "./routes/chat";
import { auth } from "./lib/better-auth";
import { logger } from "hono/logger";
import { HTTPException } from "hono/http-exception";
import todo from "./routes/todo";

const app = new Hono<{ Bindings: CloudflareBindings }>()

	.basePath("/api")
	.use("*", logger())
	.use("*", async (c, next) => {
		return cors({
			origin: c.env.WEB_URL,
			credentials: true,
		})(c, next);
	})

	// Better Auth — lives at /api/auth/*
	.on(["GET", "POST"], "/auth/*", (c) => auth(c.env).handler(c.req.raw))

	.route("/chat", chat).route('/todo',todo)

export type AppType = typeof app;
export default app;
