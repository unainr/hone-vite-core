import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { signOut } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"

export function SignOutButton() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  async function handleSignOut() {
    try {
      setLoading(true)

      await signOut()

      navigate({ to: "/sign-in" })
    } catch (error) {
      console.error("Sign out failed:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSignOut}
      disabled={loading}
    >
      {loading ? "Signing out..." : "Sign out"}
    </Button>
  )
}