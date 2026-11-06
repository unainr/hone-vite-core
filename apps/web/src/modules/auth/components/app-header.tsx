import { Link } from "@tanstack/react-router"
import { useSession } from "@/lib/auth-client"
import { SignOutButton } from "./sign-out-button"
import { Button } from "@/components/ui/button"

export function AppHeader() {
  const { data: session, isPending } = useSession()

  return (
    <header className="flex items-center justify-between border-b px-6 py-4">
      <div>
        {session ? (
          <>
            <p className="font-semibold">
              {session.user.name}
            </p>

            <p className="text-sm text-muted-foreground">
              {session.user.email}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Welcome
          </p>
        )}
      </div>

      <div>
        {isPending ? null : session ? (
          <SignOutButton />
        ) : (
          <Link to="/sign-in">
            <Button variant="outline" size="sm">
              Sign in
            </Button>
          </Link>
        )}
      </div>
    </header>
  )
}