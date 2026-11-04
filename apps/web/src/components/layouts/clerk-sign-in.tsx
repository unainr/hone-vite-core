import { Show, UserButton } from "@clerk/react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button"


export const SignInButtonClerk = () => {
  return (
    <>
      <Show when="signed-out">
        <Button asChild className="h-9.5 rounded-full px-4 text-sm font-medium shadow-none">
          <Link to="/sign-in">Get Started</Link>
        </Button>
      </Show>

      <Show when="signed-in">
        <div className="flex items-center gap-2">
          <UserButton
            appearance={{ elements: { avatarBox: "size-8" } }}
          />
          <Button variant="outline" asChild className="rounded-full">
            <Link to="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </Show>
    </>
  );
};