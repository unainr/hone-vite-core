import { Navigate } from "@tanstack/react-router"
import { useSession } from "@/lib/auth-client"

type Props = { children: React.ReactNode }

export function RequireAuth({ children }: Props) {
  const { data: session, isPending } = useSession()

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
      </div>
    )
  }

  if (!session) return <Navigate to="/sign-in" />

  return <>{children}</>
}