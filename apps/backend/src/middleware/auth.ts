// apps/api/src/middleware/auth.ts
import { createMiddleware } from "hono/factory"
import { HTTPException } from "hono/http-exception"
import { auth } from "../lib/better-auth"

type AuthVariables = {
  userId: string
}



export const requireUser = createMiddleware<{
  Bindings: CloudflareBindings
  Variables: AuthVariables
}>(async (c, next) => {
  const session = await auth(c.env).api.getSession({
    headers: c.req.raw.headers,
  })
  if (!session?.user) {
    throw new HTTPException(401, { message: "Please sign in to continue" })
  }
  c.set("userId", session.user.id)
  await next()
})

