import { hc } from "hono/client"
import type { AppType } from "@backend/api";
import { env } from "./env";


export const api = hc<AppType>(env.apiUrl, {
  init: {
    credentials: "include",
  },
})