
import { SignUp } from "@clerk/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sign-up")({
    component: SignUpPage,
});

function SignUpPage() {
  return (
    <div>
      <h1>Sign in or up route</h1>
      <SignUp />
    </div>
  )
}