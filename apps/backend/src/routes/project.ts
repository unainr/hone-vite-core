
import { Hono } from "hono";


import { getDb } from "../db";
import { requireUser } from "../middleware/auth";
import { TodoService } from "../services/todo.service";
import { zValidator } from "@hono/zod-validator";
import z from "zod";


const svc = (c: any) => new TodoService(getDb(c.env.DATABASE_URL))
const app = new Hono<{ Bindings: CloudflareBindings }>()

.use(requireUser)

.get('/', async (c) => {
  const userId = c.req.header('x-user-id')!
  return c.json(await svc(c).list(userId))
})

.post("/", zValidator("json", z.object({ title: z.string().min(1).max(200) })), async (c) => {
	const todo = await svc(c).create(c.var.userId, c.req.valid("json"));
	return c.json(todo, 201);
})
.patch("/:id", zValidator("json", z.object({ done: z.boolean() })), async (c) => {
	const todo = await svc(c).toggle(c.req.param("id"), c.var.userId, c.req.valid("json").done);
	if (!todo) return c.json({ error: "Not found" }, 404);
	return c.json(todo);
})



export default app;
