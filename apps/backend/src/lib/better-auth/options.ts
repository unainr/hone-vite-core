// apps/api/src/lib/better-auth/options.ts
import type { BetterAuthOptions } from "better-auth"

export const betterAuthOptions: BetterAuthOptions = {
  appName: "My App",
  basePath: "/api/auth",
  emailAndPassword: { enabled: true },
  
}