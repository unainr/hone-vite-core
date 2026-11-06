import { Button } from "@/components/ui/button"
import { useSignOut } from "@/hooks/use-sign-out"

export function SignOutButton() {
  const { signOut, pending } = useSignOut()

  return (
    <Button variant="outline" size="sm" onClick={signOut} disabled={pending}>
      {pending ? "Signing out..." : "Sign out"}
    </Button>
  )
}