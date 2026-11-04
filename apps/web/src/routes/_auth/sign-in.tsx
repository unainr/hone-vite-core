import { SignIn } from "@clerk/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/sign-in")({
    component: SignInPage,
});

function SignInPage() {
  return (
    <>
    
      <SignIn />
    </>
  )
}