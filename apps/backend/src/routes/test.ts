
import { zValidator } from "@hono/zod-validator";

import { Hono } from "hono";
import { z } from "zod";
// import { requireUser } from "../middleware/auth";




const app = new Hono<{ Bindings: CloudflareBindings }>()

	.get("/", async (c) => {
		return c.json({ message: "test route Hello world" });
	})


	

export default app;