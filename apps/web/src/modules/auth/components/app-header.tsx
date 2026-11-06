import { Link } from "@tanstack/react-router"
import { LogOut } from "lucide-react"
import { useSession } from "@/lib/auth-client"
import { useSignOut } from "@/hooks/use-sign-out"
import { buttonVariants } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function getInitials(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.trim() || "?"
  const parts = source.split(/\s+/).filter(Boolean)
  const initials =
    parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : source.slice(0, 2)
  return initials.toUpperCase()
}

function UserMenu() {
  const { data: session } = useSession()
  const { signOut, pending } = useSignOut()

  if (!session) return null

  const { name, email, image } = session.user

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open user menu"
        className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
        <Avatar className="size-9">
          {image && <AvatarImage src={image} alt={name ?? "User avatar"} />}
          <AvatarFallback className="text-xs font-medium">
            {getInitials(name, email)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="font-normal">
          <p className="truncate text-sm font-medium">{name}</p>
          <p className="truncate text-xs text-muted-foreground">{email}</p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={signOut} disabled={pending}>
          <LogOut className="size-4" />
          {pending ? "Signing out..." : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function AppHeader() {
  const { data: session, isPending } = useSession()

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">


        {isPending ? (
          <Skeleton className="size-9 rounded-full" />
        ) : session ? (
          <UserMenu />
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/sign-in"
              className={buttonVariants({ variant: "ghost", size: "sm" })}>
              Sign in
            </Link>
            <Link to="/sign-up" className={buttonVariants({ size: "sm" })}>
              Sign up
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}