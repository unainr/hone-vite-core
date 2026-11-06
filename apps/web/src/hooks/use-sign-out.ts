import { useState } from "react"
import { useNavigate, useRouter } from "@tanstack/react-router"
import { signOut } from "@/lib/auth-client"

export function useSignOut() {
  const navigate = useNavigate()
  const router = useRouter()
  const [pending, setPending] = useState(false)

  async function handleSignOut() {
    setPending(true)

    // Better Auth returns { error } instead of throwing
    const { error } = await signOut()

    if (error) {
      console.error("Sign out failed:", error)
      setPending(false)
      return
    }

    // Clear cached route data so protected pages re-check the session
    await router.invalidate()
    await navigate({ to: "/sign-in" })
    setPending(false)
  }

  return { signOut: handleSignOut, pending }
}