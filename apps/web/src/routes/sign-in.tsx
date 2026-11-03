import { SignIn } from "@clerk/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sign-in")({
    component: SignInPage,
});

function SignInPage() {
  return (
    <div>
      <h1>Sign in or up route</h1>
      <SignIn />
    </div>
  )
}